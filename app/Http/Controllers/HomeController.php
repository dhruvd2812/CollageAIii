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

        $products = Product::where('status', 'active')
            ->with(['category', 'images', 'primaryImage', 'options.values', 'reviews'])
            ->latest()
            ->paginate(16)
            ->withQueryString();

        return Inertia::render('home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
