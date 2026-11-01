<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CustomerAccountController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderNotificationController;
use App\Http\Controllers\OrderSuccessController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Storefront Routes
|--------------------------------------------------------------------------
*/

// Homepage / Initial Entry: Forces Login first
Route::get('/', function (\Illuminate\Http\Request $request) {
    if (!$request->user()) {
        return redirect()->route('login');
    }

    if ($request->user()->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('shop.index');
})->name('home');

// Authenticated Storefront Routes (Flipkart Shopping Experience)
Route::middleware(['auth'])->group(function () {
    // Shop & Product Discovery
    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
    Route::get('/category/{category}', [ShopController::class, 'category'])->name('shop.category');
    Route::get('/product/{product}', [ShopController::class, 'show'])->name('shop.product');
    Route::get('/search', [ShopController::class, 'search'])->name('shop.search');

    // Shopping Bag / Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/items', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/items/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/cart/coupon', [CartController::class, 'applyCoupon'])->name('cart.coupon.apply');
    Route::delete('/cart/coupon', [CartController::class, 'removeCoupon'])->name('cart.coupon.remove');
    Route::get('/cart/summary', [CartController::class, 'summary'])->name('cart.summary');

    // File / Design Uploads
    Route::post('/uploads/design', [UploadController::class, 'store'])->name('upload.design');

    // Checkout & Orders
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
    Route::get('/order-success/{order}', [OrderSuccessController::class, 'show'])->name('order.success');
});

// Order Notification Status Webhook / Callback
Route::post('/api/order-notifications/record', [OrderNotificationController::class, 'recordBrowserEmail'])->name('order.notifications.record');

// Wishlist (Public & Auth)
Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
Route::post('/wishlist/{product}/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');

// Informational & Policy Pages
Route::get('/about', [PageController::class, 'about'])->name('pages.about');
Route::get('/contact', [PageController::class, 'contact'])->name('pages.contact');
Route::get('/custom-design', [PageController::class, 'customDesign'])->name('pages.custom-design');
Route::get('/privacy-policy', [PageController::class, 'privacyPolicy'])->name('pages.privacy-policy');
Route::get('/terms', [PageController::class, 'terms'])->name('pages.terms');
Route::get('/shipping-policy', [PageController::class, 'shippingPolicy'])->name('pages.shipping-policy');
Route::get('/refund-policy', [PageController::class, 'refundPolicy'])->name('pages.refund-policy');

/*
|--------------------------------------------------------------------------
| Customer Account Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based redirect on login
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
        if ($request->user() && $request->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('shop.index');
    })->name('dashboard');

    // Customer Account
    Route::get('/account', [CustomerAccountController::class, 'index'])->name('account.index');
    Route::get('/account/profile', [CustomerAccountController::class, 'profile'])->name('account.profile');
    Route::put('/account/profile', [CustomerAccountController::class, 'updateProfile'])->name('account.profile.update');
    
    Route::get('/account/orders', [CustomerAccountController::class, 'orders'])->name('account.orders');
    Route::get('/account/orders/{order}', [CustomerAccountController::class, 'orderDetail'])->name('account.orders.show');
    Route::post('/account/orders/{order}/cancel', [CustomerAccountController::class, 'cancelOrder'])->name('account.orders.cancel');
    
    Route::get('/account/addresses', [CustomerAccountController::class, 'addresses'])->name('account.addresses');
    Route::post('/account/addresses', [CustomerAccountController::class, 'storeAddress'])->name('account.addresses.store');
    Route::put('/account/addresses/{address}', [CustomerAccountController::class, 'updateAddress'])->name('account.addresses.update');
    Route::delete('/account/addresses/{address}', [CustomerAccountController::class, 'destroyAddress'])->name('account.addresses.destroy');
    Route::post('/account/addresses/{address}/default', [CustomerAccountController::class, 'setDefaultAddress'])->name('account.addresses.default');

    Route::get('/account/wishlist', [WishlistController::class, 'index'])->name('account.wishlist');

    Route::get('/account/email-preferences', [CustomerAccountController::class, 'emailPreferences'])->name('account.email-preferences');
    Route::put('/account/email-preferences', [CustomerAccountController::class, 'updateEmailPreferences'])->name('account.email-preferences.update');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    /*
    |--------------------------------------------------------------------------
    | Admin Management Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminOrderController::class, 'dashboard'])->name('dashboard');
        Route::get('/dashboard', [AdminOrderController::class, 'dashboard'])->name('dashboard.view');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::put('/orders/{order}/payment', [AdminOrderController::class, 'updatePayment'])->name('orders.payment');
        Route::put('/orders/{order}/tracking', [AdminOrderController::class, 'updateTracking'])->name('orders.tracking');

        // Products Management
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::patch('/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
    });
});

require __DIR__ . '/settings.php';
