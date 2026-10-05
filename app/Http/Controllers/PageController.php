<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('pages/about');
    }

    public function contact(): Response
    {
        return Inertia::render('pages/contact');
    }

    public function customDesign(): Response
    {
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        $customizableProducts = Product::where('status', 'active')
            ->where('is_customizable', true)
            ->with(['category', 'images', 'options.values'])
            ->get();

        return Inertia::render('pages/custom-design', [
            'categories' => $categories,
            'customizableProducts' => $customizableProducts,
        ]);
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('pages/privacy-policy');
    }

    public function terms(): Response
    {
        return Inertia::render('pages/terms');
    }

    public function shippingPolicy(): Response
    {
        return Inertia::render('pages/shipping-policy');
    }

    public function refundPolicy(): Response
    {
        return Inertia::render('pages/refund-policy');
    }
}
