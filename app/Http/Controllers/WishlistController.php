<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function __construct(protected CartService $cartService) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $wishlistProducts = [];

        if ($user) {
            $wishlists = Wishlist::where('user_id', $user->id)
                ->with(['product.images', 'product.category'])
                ->latest()
                ->get();

            $wishlistProducts = $wishlists->pluck('product')->filter();
        }

        return Inertia::render('account/wishlist', [
            'wishlistProducts' => $wishlistProducts,
        ]);
    }

    public function toggle(Request $request): JsonResponse|RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $productId = (int) $request->input('product_id');
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => true,
                'is_liked' => false,
                'message' => 'Please log in to save items to your account wishlist.',
                'guest' => true,
            ]);
        }

        $existing = Wishlist::where('user_id', $user->id)->where('product_id', $productId)->first();

        if ($existing) {
            $existing->delete();
            $isLiked = false;
            $message = 'Removed from your wishlist.';
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            $isLiked = true;
            $message = 'Saved to your wishlist!';
        }

        $count = Wishlist::where('user_id', $user->id)->count();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_liked' => $isLiked,
                'count' => $count,
                'message' => $message,
            ]);
        }

        return redirect()->back()->with('success', $message);
    }

    public function destroy(Product $product, Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        if ($user) {
            Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->delete();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist.',
            ]);
        }

        return redirect()->back()->with('success', 'Removed from wishlist.');
    }

    public function moveToCart(Product $product, Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $cart = $this->cartService->getOrCreateCart($user, $request->session()->getId());

        $this->cartService->addItem($cart, $product, 1);

        if ($user) {
            Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->delete();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Moved product to your shopping bag!',
            ]);
        }

        return redirect()->back()->with('success', 'Moved to bag!');
    }
}
