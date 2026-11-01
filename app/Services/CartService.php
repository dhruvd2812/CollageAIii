<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\DesignUpload;
use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartService
{
    public function getOrCreateCart(?User $user, ?string $sessionId = null): Cart
    {
        if ($user) {
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'currency' => 'INR',
                    'expires_at' => Carbon::now()->addDays(30),
                ]
            );

            // If there's a guest session cart with items, merge it into the user cart
            if ($sessionId) {
                $sessionCart = Cart::where('session_id', $sessionId)->whereNull('user_id')->first();
                if ($sessionCart && $sessionCart->id !== $cart->id) {
                    $this->mergeCarts($sessionCart, $cart);
                }
            }

            return $cart->load(['items.product.images', 'items.uploads']);
        }

        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        $cart = Cart::firstOrCreate(
            ['session_id' => $sessionId],
            [
                'currency' => 'INR',
                'expires_at' => Carbon::now()->addDays(14),
            ]
        );

        return $cart->load(['items.product.images', 'items.uploads']);
    }

    public function addItem(
        Cart $cart,
        Product $product,
        int $quantity,
        array $selectedOptions = [],
        ?int $uploadId = null,
        ?string $customNotes = null
    ): CartItem {
        $quantity = max(1, min(1000, $quantity));

        // Inventory check: ensure product is active and has available stock
        if ($product->status !== 'active') {
            throw new Exception("This product is currently unavailable.");
        }

        if ($product->manage_stock) {
            if ($product->stock_quantity <= 0) {
                throw new Exception("Sorry, \"{$product->name}\" is currently out of stock.");
            }
            if ($quantity > $product->stock_quantity) {
                throw new Exception("Only {$product->stock_quantity} units available for \"{$product->name}\".");
            }
        }

        // Calculate unit price based on base price and selected options
        $calculatedUnitPrice = $product->effective_price;
        $customizationPayload = [];

        // Validate and apply options
        foreach ($product->options as $option) {
            $optCode = $option->code;
            $selectedVal = $selectedOptions[$optCode] ?? null;

            if ($selectedVal !== null && $selectedVal !== '') {
                $optionVal = $option->values->firstWhere('value', $selectedVal);
                if ($optionVal) {
                    $calculatedUnitPrice += $optionVal->price_adjustment;
                    $customizationPayload[$optCode] = [
                        'option_id' => $option->id,
                        'option_name' => $option->name,
                        'value' => $optionVal->value,
                        'label' => $optionVal->label,
                        'price_adjustment' => $optionVal->price_adjustment,
                    ];
                }
            } elseif ($option->is_required && $option->values->isNotEmpty()) {
                // Pick default first option value if required but not specified
                $defaultVal = $option->values->first();
                $calculatedUnitPrice += $defaultVal->price_adjustment;
                $customizationPayload[$optCode] = [
                    'option_id' => $option->id,
                    'option_name' => $option->name,
                    'value' => $defaultVal->value,
                    'label' => $defaultVal->label,
                    'price_adjustment' => $defaultVal->price_adjustment,
                ];
            }
        }

        if ($customNotes) {
            $customizationPayload['notes'] = [
                'option_name' => 'Custom Text / Instructions',
                'value' => $customNotes,
                'label' => $customNotes,
                'price_adjustment' => 0,
            ];
        }

        // Generate configuration hash
        $hashData = [
            'product_id' => $product->id,
            'options' => $customizationPayload,
            'upload_id' => $uploadId,
        ];
        $configHash = md5(json_encode($hashData));

        return DB::transaction(function () use ($cart, $product, $quantity, $calculatedUnitPrice, $customizationPayload, $configHash, $uploadId) {
            $item = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->where('configuration_hash', $configHash)
                ->first();

            if ($item) {
                $newQuantity = $item->quantity + $quantity;
                if ($product->manage_stock && $newQuantity > $product->stock_quantity) {
                    throw new Exception("Cannot add more. Only {$product->stock_quantity} units available for \"{$product->name}\".");
                }

                $item->update([
                    'quantity' => $newQuantity,
                    'unit_price' => $calculatedUnitPrice,
                ]);
            } else {
                $item = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'configuration_hash' => $configHash,
                    'quantity' => $quantity,
                    'unit_price' => $calculatedUnitPrice,
                    'customization' => $customizationPayload,
                ]);

                if ($uploadId) {
                    $upload = DesignUpload::find($uploadId);
                    if ($upload) {
                        $item->uploads()->syncWithoutDetaching([$upload->id]);
                    }
                }
            }

            return $item->load(['product.images', 'uploads']);
        });
    }

    public function updateItemQuantity(CartItem $cartItem, int $quantity): ?CartItem
    {
        if ($quantity <= 0) {
            $cartItem->delete();
            return null;
        }

        $product = $cartItem->product;
        if ($product && $product->manage_stock && $quantity > $product->stock_quantity) {
            throw new Exception("Only {$product->stock_quantity} units available for \"{$product->name}\".");
        }

        $cartItem->update(['quantity' => min(1000, $quantity)]);
        return $cartItem;
    }

    public function removeItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    public function calculateSummary(Cart $cart, ?string $couponCode = null, ?int $userId = null): array
    {
        $items = $cart->items()->with(['product.images', 'uploads'])->get();
        $subtotal = 0;

        $formattedItems = [];
        foreach ($items as $item) {
            $product = $item->product;
            $lineTotal = $item->unit_price * $item->quantity;
            $subtotal += $lineTotal;

            $primaryImg = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
            $customUpload = $item->uploads->first();

            $formattedItems[] = [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'unit_price' => $item->unit_price,
                'quantity' => $item->quantity,
                'line_total' => $lineTotal,
                'image' => $primaryImg ? $primaryImg->url : '',
                'customization' => $item->customization,
                'upload' => $customUpload ? [
                    'id' => $customUpload->id,
                    'name' => $customUpload->original_name,
                    'url' => $customUpload->url,
                    'is_image' => $customUpload->is_image,
                ] : null,
            ];
        }

        $discount = 0;
        $couponData = null;

        if ($couponCode) {
            $coupon = Coupon::where('code', strtoupper(trim($couponCode)))->first();
            if ($coupon) {
                $validation = $coupon->isValidFor($subtotal, $userId);
                if ($validation['valid']) {
                    $discount = $validation['discount'];
                    $couponData = [
                        'code' => $coupon->code,
                        'discount' => $discount,
                        'type' => $coupon->discount_type,
                        'message' => $validation['message'],
                    ];
                } else {
                    $couponData = [
                        'code' => $couponCode,
                        'discount' => 0,
                        'error' => $validation['message'],
                    ];
                }
            } else {
                $couponData = [
                    'code' => $couponCode,
                    'discount' => 0,
                    'error' => 'Coupon code is invalid or not found.',
                ];
            }
        }

        // Free shipping on subtotal >= 799 or if cart is empty
        $shipping = ($subtotal >= 799 || $subtotal === 0) ? 0 : 79;
        $tax = 0; // GST included in prices
        $grandTotal = max(0, $subtotal - $discount + $shipping + $tax);

        return [
            'items' => $formattedItems,
            'items_count' => count($formattedItems),
            'total_quantity' => array_sum(array_column($formattedItems, 'quantity')),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'free_shipping_threshold' => 799,
            'amount_for_free_shipping' => max(0, 799 - $subtotal),
            'tax' => $tax,
            'grand_total' => $grandTotal,
            'coupon' => $couponData,
        ];
    }

    private function mergeCarts(Cart $sourceCart, Cart $targetCart): void
    {
        DB::transaction(function () use ($sourceCart, $targetCart) {
            foreach ($sourceCart->items as $sItem) {
                $existing = CartItem::where('cart_id', $targetCart->id)
                    ->where('product_id', $sItem->product_id)
                    ->where('configuration_hash', $sItem->configuration_hash)
                    ->first();

                if ($existing) {
                    $existing->update(['quantity' => $existing->quantity + $sItem->quantity]);
                } else {
                    $newItem = $sItem->replicate();
                    $newItem->cart_id = $targetCart->id;
                    $newItem->save();

                    foreach ($sItem->uploads as $u) {
                        $newItem->uploads()->syncWithoutDetaching([$u->id]);
                    }
                }
            }

            $sourceCart->items()->delete();
            $sourceCart->delete();
        });
    }
}
