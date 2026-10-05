<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        $query = Product::where('status', 'active')
            ->with(['category', 'images', 'options.values', 'reviews']);

        // Category filter
        if ($request->filled('category')) {
            $catSlug = $request->input('category');
            $query->whereHas('category', fn ($q) => $q->where('slug', $catSlug));
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', (int) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', (int) $request->input('max_price'));
        }

        // Search query
        if ($request->filled('q')) {
            $term = trim($request->input('q'));
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('short_description', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('sku', 'like', "%{$term}%");
            });
        }

        // Sorting
        $sort = $request->input('sort', 'featured');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('base_price', 'desc');
                break;
            case 'newest':
                $query->latest();
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_featured', 'desc')->latest();
                break;
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $request->input('category', ''),
                'min_price' => $request->input('min_price', ''),
                'max_price' => $request->input('max_price', ''),
                'q' => $request->input('q', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function category(string $slug, Request $request): Response
    {
        $category = Category::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        $query = Product::where('category_id', $category->id)
            ->where('status', 'active')
            ->with(['category', 'images', 'options.values', 'reviews']);

        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', (int) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', (int) $request->input('max_price'));
        }

        $sort = $request->input('sort', 'featured');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('base_price', 'desc');
                break;
            case 'newest':
                $query->latest();
                break;
            default:
                $query->orderBy('is_featured', 'desc')->latest();
                break;
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('shop/category', [
            'category' => $category,
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'min_price' => $request->input('min_price', ''),
                'max_price' => $request->input('max_price', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function show(string $slug, Request $request): Response
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'active')
            ->with(['category', 'images', 'options.values', 'reviews.user'])
            ->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->with(['category', 'images', 'options.values'])
            ->take(4)
            ->get();

        $user = $request->user();
        $canReview = false;
        $purchasedOrderItemId = null;

        if ($user) {
            // Check if customer has an order item for this product that hasn't been reviewed yet
            $unreviewedItem = \App\Models\OrderItem::where('product_id', $product->id)
                ->whereHas('order', fn ($q) => $q->where('user_id', $user->id)->whereIn('order_status', ['delivered', 'confirmed', 'processing', 'shipped']))
                ->whereDoesntHave('review')
                ->first();

            if ($unreviewedItem) {
                $canReview = true;
                $purchasedOrderItemId = $unreviewedItem->id;
            }
        }

        return Inertia::render('shop/product', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'canReview' => $canReview,
            'purchasedOrderItemId' => $purchasedOrderItemId,
        ]);
    }

    public function search(Request $request): Response
    {
        $term = trim($request->input('q', ''));
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        $query = Product::where('status', 'active')
            ->with(['category', 'images', 'options.values']);

        if ($term !== '') {
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('short_description', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('sku', 'like', "%{$term}%")
                    ->orWhereHas('category', fn ($cq) => $cq->where('name', 'like', "%{$term}%"));
            });
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('shop/search', [
            'query' => $term,
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
