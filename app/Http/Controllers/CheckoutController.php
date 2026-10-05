<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderNotificationService;
use App\Services\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        protected CartService $cartService,
        protected OrderService $orderService,
        protected OrderNotificationService $notificationService
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user, $request->session()->getId());
        $couponCode = $request->session()->get('cart_coupon');
        $summary = $this->cartService->calculateSummary($cart, $couponCode, $user?->id);

        if (empty($summary['items'])) {
            return redirect()->route('cart.index')->with('error', 'Your shopping bag is empty. Please add products first.');
        }

        $savedAddresses = $user ? $user->addresses()->get() : [];

        return Inertia::render('checkout/index', [
            'cart' => $summary,
            'savedAddresses' => $savedAddresses,
            'defaultAddress' => $user?->defaultAddress,
            'appliedCoupon' => $couponCode,
        ]);
    }

    public function process(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user, $request->session()->getId());
        $couponCode = $request->session()->get('cart_coupon');

        $validated = $request->validate([
            'customer_name' => 'required|string|max:150',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:30',
            'recipient_name' => 'required|string|max:150',
            'phone' => 'required|string|max:30',
            'line_one' => 'required|string|max:255',
            'line_two' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:255',
            'city' => 'required|string|max:120',
            'state' => 'required|string|max:120',
            'postal_code' => 'required|string|max:20',
            'country_code' => 'nullable|string|max:2',
            'payment_method' => 'required|string|in:cod,manual',
            'customer_notes' => 'nullable|string|max:1000',
            'save_address' => 'nullable|boolean',
        ]);

        $shippingAddress = [
            'recipient_name' => $validated['recipient_name'],
            'phone' => $validated['phone'],
            'line_one' => $validated['line_one'],
            'line_two' => $validated['line_two'] ?? '',
            'landmark' => $validated['landmark'] ?? '',
            'city' => $validated['city'],
            'state' => $validated['state'],
            'postal_code' => $validated['postal_code'],
            'country' => 'India',
            'country_code' => $validated['country_code'] ?? 'IN',
        ];

        $customerData = [
            'name' => $validated['customer_name'],
            'email' => $validated['customer_email'],
            'phone' => $validated['customer_phone'],
        ];

        try {
            $order = $this->orderService->createOrderFromCart(
                $cart,
                $customerData,
                $shippingAddress,
                null,
                $validated['payment_method'],
                $couponCode,
                $validated['customer_notes'] ?? null,
                $user
            );

            // If user checked save address
            if ($user && !empty($validated['save_address'])) {
                Address::create([
                    'user_id' => $user->id,
                    'recipient_name' => $validated['recipient_name'],
                    'phone' => $validated['phone'],
                    'line_one' => $validated['line_one'],
                    'line_two' => $validated['line_two'] ?? null,
                    'landmark' => $validated['landmark'] ?? null,
                    'city' => $validated['city'],
                    'state' => $validated['state'],
                    'postal_code' => $validated['postal_code'],
                    'country_code' => $validated['country_code'] ?? 'IN',
                    'is_default' => $user->addresses()->count() === 0,
                ]);
            }

            // Forget session coupon
            $request->session()->forget('cart_coupon');

            $emailJsPayload = $this->notificationService->formatEmailPayload($order);

            // Put emailJs payload in flash session so order-success page can send it via browser EmailJS
            $request->session()->flash('emailjs_order_payload', $emailJsPayload);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'order_number' => $order->order_number,
                    'redirect_url' => route('order.success', ['order' => $order->order_number]),
                    'emailjs_payload' => $emailJsPayload,
                ]);
            }

            return redirect()->route('order.success', ['order' => $order->order_number]);
        } catch (Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 422);
            }

            return redirect()->back()->withErrors(['checkout' => $e->getMessage()])->withInput();
        }
    }
}
