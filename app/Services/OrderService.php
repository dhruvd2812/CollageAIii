<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemCustomization;
use App\Models\OrderItemUpload;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        protected CartService $cartService,
        protected OrderNotificationService $notificationService
    ) {}

    public function createOrderFromCart(
        Cart $cart,
        array $customerData,
        array $shippingAddress,
        ?array $billingAddress = null,
        string $paymentMethod = 'cod',
        ?string $couponCode = null,
        ?string $customerNotes = null,
        ?User $user = null
    ): Order {
        $cartSummary = $this->cartService->calculateSummary($cart, $couponCode, $user?->id);

        if (empty($cartSummary['items'])) {
            throw new Exception('Your shopping bag is empty.');
        }

        return DB::transaction(function () use (
            $cart,
            $cartSummary,
            $customerData,
            $shippingAddress,
            $billingAddress,
            $paymentMethod,
            $couponCode,
            $customerNotes,
            $user
        ) {
            $orderNumber = Order::generateOrderNumber();
            $coupon = null;
            if ($couponCode) {
                $coupon = Coupon::where('code', strtoupper(trim($couponCode)))->first();
            }

            // 1. Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user?->id,
                'coupon_id' => $coupon?->id,
                'coupon_code' => $coupon?->code,
                'customer_name' => $customerData['name'],
                'customer_email' => $customerData['email'],
                'customer_phone' => $customerData['phone'] ?? null,
                'currency' => 'INR',
                'subtotal' => $cartSummary['subtotal'],
                'discount_total' => $cartSummary['discount'],
                'shipping_total' => $cartSummary['shipping'],
                'tax_total' => $cartSummary['tax'],
                'grand_total' => $cartSummary['grand_total'],
                'order_status' => 'pending',
                'payment_status' => $paymentMethod === 'cod' ? 'pending' : 'paid',
                'payment_method' => $paymentMethod === 'cod' ? 'Cash on Delivery / Manual Order' : 'Online / Card / UPI',
                'shipping_method' => 'Standard Express Courier (2-4 Days)',
                'shipping_address' => $shippingAddress,
                'billing_address' => $billingAddress ?? $shippingAddress,
                'customer_notes' => $customerNotes,
                'placed_at' => Carbon::now(),
            ]);

            // 2. Create Order Items
            $cartItems = $cart->items()->with(['product', 'uploads'])->get();
            foreach ($cartItems as $cItem) {
                $product = $cItem->product;
                $primaryImg = $product->images->firstWhere('is_primary', true) ?? $product->images->first();

                // Check and decrement stock if managed
                if ($product->manage_stock) {
                    if ($product->stock_quantity < $cItem->quantity) {
                        throw new Exception("Insufficient stock for \"{$product->name}\". Only {$product->stock_quantity} remaining.");
                    }
                    $product->decrement('stock_quantity', $cItem->quantity);
                }

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'product_image_path' => $primaryImg ? $primaryImg->url : '',
                    'quantity' => $cItem->quantity,
                    'unit_price' => $cItem->unit_price,
                    'line_total' => $cItem->unit_price * $cItem->quantity,
                    'currency' => 'INR',
                ]);

                // Order Item Customizations
                if (!empty($cItem->customization) && is_array($cItem->customization)) {
                    foreach ($cItem->customization as $code => $opt) {
                        OrderItemCustomization::create([
                            'order_item_id' => $orderItem->id,
                            'product_option_id' => $opt['option_id'] ?? null,
                            'option_name' => $opt['option_name'] ?? $code,
                            'option_code' => $code,
                            'value' => ['value' => $opt['value'] ?? ''],
                            'display_value' => $opt['label'] ?? ($opt['value'] ?? ''),
                            'price_adjustment' => $opt['price_adjustment'] ?? 0,
                        ]);
                    }
                }

                // Order Item Uploads
                foreach ($cItem->uploads as $upload) {
                    OrderItemUpload::create([
                        'order_item_id' => $orderItem->id,
                        'design_upload_id' => $upload->id,
                        'disk' => $upload->disk,
                        'path' => $upload->path,
                        'original_name' => $upload->original_name,
                        'mime_type' => $upload->mime_type,
                        'size_bytes' => $upload->size_bytes,
                    ]);
                }
            }

            // 3. Coupon Usage
            if ($coupon && $cartSummary['discount'] > 0) {
                CouponUsage::create([
                    'coupon_id' => $coupon->id,
                    'order_id' => $order->id,
                    'user_id' => $user?->id,
                    'discount_amount' => $cartSummary['discount'],
                ]);
            }

            // 4. Initial Payment Record
            Payment::create([
                'order_id' => $order->id,
                'provider' => 'manual',
                'payment_method' => $paymentMethod,
                'provider_reference' => 'MANUAL-' . strtoupper(Str::random(10)),
                'amount' => $order->grand_total,
                'currency' => 'INR',
                'status' => 'pending',
                'paid_at' => null,
            ]);

            // 5. Initial Status History
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'changed_by_user_id' => $user?->id,
                'from_status' => null,
                'to_status' => 'pending',
                'note' => 'Order placed successfully by customer via web storefront.',
            ]);

            // 6. Notification Record
            $ownerEmail = config('mail.from.address', 'owner@printwithdwarkesh.com');
            $this->notificationService->createPendingNotification($order, $ownerEmail, 'owner_order_alert');

            // 7. Clear Cart Items
            $cart->items()->delete();

            return $order->load(['items.customizations', 'items.uploads']);
        });
    }
}
