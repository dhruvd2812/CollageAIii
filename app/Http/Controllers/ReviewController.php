<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            abort(401, 'Please log in to submit a review.');
        }

        $validated = $request->validate([
            'order_item_id' => 'required|exists:order_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|min:5|max:2000',
        ]);

        $orderItem = OrderItem::with('order')->findOrFail($validated['order_item_id']);

        if ($orderItem->order->user_id !== $user->id) {
            abort(403, 'You can only review products from your verified orders.');
        }

        if ($orderItem->review()->exists()) {
            return redirect()->back()->withErrors(['review' => 'You have already reviewed this item.']);
        }

        Review::create([
            'user_id' => $user->id,
            'product_id' => $orderItem->product_id,
            'order_id' => $orderItem->order_id,
            'order_item_id' => $orderItem->id,
            'rating' => (int) $validated['rating'],
            'review' => $validated['review'],
            'status' => 'approved',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you for your review!',
            ]);
        }

        return redirect()->back()->with('success', 'Thank you! Your verified purchase review has been submitted.');
    }
}
