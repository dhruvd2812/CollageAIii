<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $featuredProducts = Product::where('status', 'active')
            ->where('is_featured', true)
            ->with(['category', 'images', 'options.values', 'reviews'])
            ->latest()
            ->take(8)
            ->get();

        $popularProducts = Product::where('status', 'active')
            ->with(['category', 'images', 'options.values', 'reviews'])
            ->inRandomOrder()
            ->take(8)
            ->get();

        return Inertia::render('home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'popularProducts' => $popularProducts,
        ]);
    }
}
