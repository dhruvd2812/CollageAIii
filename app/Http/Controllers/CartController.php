<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(protected CartService $cartService) {}

    public function index(Request $request): Response
    {
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());
        $couponCode = $request->session()->get('cart_coupon');
        $summary = $this->cartService->calculateSummary($cart, $couponCode, $request->user()?->id);

        return Inertia::render('cart/index', [
            'cart' => $summary,
            'appliedCoupon' => $couponCode,
        ]);
    }

    public function summary(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());
        $couponCode = $request->session()->get('cart_coupon');
        $summary = $this->cartService->calculateSummary($cart, $couponCode, $request->user()?->id);

        return response()->json($summary);
    }

    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:1000',
            'options' => 'nullable|array',
            'upload_id' => 'nullable|exists:design_uploads,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $product = Product::with(['options.values'])->findOrFail($request->input('product_id'));
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());

        $item = $this->cartService->addItem(
            $cart,
            $product,
            (int) $request->input('quantity', 1),
            $request->input('options', []),
            $request->input('upload_id') ? (int) $request->input('upload_id') : null,
            $request->input('notes')
        );

        $couponCode = $request->session()->get('cart_coupon');
        $summary = $this->cartService->calculateSummary($cart, $couponCode, $request->user()?->id);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Item added to bag!',
                'cart' => $summary,
                'item' => $item,
            ]);
        }

        return redirect()->back()->with('success', 'Item added to bag!');
    }

    public function update(CartItem $cartItem, Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:0|max:1000',
        ]);

        $this->cartService->updateItemQuantity($cartItem, (int) $request->input('quantity'));
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());
        $couponCode = $request->session()->get('cart_coupon');
        $summary = $this->cartService->calculateSummary($cart, $couponCode, $request->user()?->id);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'cart' => $summary,
            ]);
        }

        return redirect()->back()->with('success', 'Bag updated.');
    }

    public function destroy(CartItem $cartItem, Request $request): JsonResponse|RedirectResponse
    {
        $this->cartService->removeItem($cartItem);
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());
        $couponCode = $request->session()->get('cart_coupon');
        $summary = $this->cartService->calculateSummary($cart, $couponCode, $request->user()?->id);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Item removed from bag.',
                'cart' => $summary,
            ]);
        }

        return redirect()->back()->with('success', 'Item removed.');
    }

    public function applyCoupon(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|max:50',
        ]);

        $code = strtoupper(trim($request->input('code')));
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());
        $summary = $this->cartService->calculateSummary($cart, $code, $request->user()?->id);

        if (isset($summary['coupon']['error'])) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $summary['coupon']['error'],
                ], 422);
            }
            return redirect()->back()->withErrors(['coupon' => $summary['coupon']['error']]);
        }

        $request->session()->put('cart_coupon', $code);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Coupon applied successfully!',
                'cart' => $summary,
            ]);
        }

        return redirect()->back()->with('success', 'Coupon applied successfully!');
    }

    public function removeCoupon(Request $request): JsonResponse|RedirectResponse
    {
        $request->session()->forget('cart_coupon');
        $cart = $this->cartService->getOrCreateCart($request->user(), $request->session()->getId());
        $summary = $this->cartService->calculateSummary($cart, null, $request->user()?->id);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Coupon removed.',
                'cart' => $summary,
            ]);
        }

        return redirect()->back()->with('success', 'Coupon removed.');
    }
}
