<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $totalRevenue = (int) Order::where('payment_status', 'paid')->sum('grand_total');
        $totalOrders = Order::count();
        $pendingOrders = Order::whereIn('order_status', ['pending', 'design_review', 'processing'])->count();
        $totalCustomers = User::count();

        $recentOrders = Order::with('items')->latest()->take(8)->get();
        $recentReviews = Review::with(['user', 'product'])->latest()->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_customers' => $totalCustomers,
            ],
            'recentOrders' => $recentOrders,
            'recentReviews' => $recentReviews,
        ]);
    }

    public function index(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $query = Order::with(['items', 'user'])->latest();

        if ($request->filled('status')) {
            $query->where('order_status', $request->input('status'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->input('payment_status'));
        }

        if ($request->filled('q')) {
            $term = trim($request->input('q'));
            $query->where(function ($q) use ($term) {
                $q->where('order_number', 'like', "%{$term}%")
                    ->orWhere('customer_name', 'like', "%{$term}%")
                    ->orWhere('customer_email', 'like', "%{$term}%")
                    ->orWhere('customer_phone', 'like', "%{$term}%");
            });
        }

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->input('status', ''),
                'payment_status' => $request->input('payment_status', ''),
                'q' => $request->input('q', ''),
            ],
        ]);
    }

    public function show(Order $order, Request $request): Response
    {
        $this->authorizeAdmin($request);

        $order->load([
            'items.customizations',
            'items.uploads',
            'statusHistories.user',
            'payments',
            'notifications',
            'user',
        ]);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Order $order, Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'order_status' => 'required|string|in:pending,confirmed,processing,design_review,printing,ready_to_ship,shipped,delivered,cancelled',
            'note' => 'nullable|string|max:1000',
        ]);

        $fromStatus = $order->order_status;
        $toStatus = $validated['order_status'];

        $order->update([
            'order_status' => $toStatus,
            'cancelled_at' => $toStatus === 'cancelled' ? now() : null,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'changed_by_user_id' => $request->user()->id,
            'from_status' => $fromStatus,
            'to_status' => $toStatus,
            'note' => $validated['note'] ?? "Status updated by admin to {$toStatus}.",
        ]);

        return redirect()->back()->with('success', "Order status updated to {$toStatus}.");
    }

    public function updatePayment(Order $order, Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'payment_status' => 'required|string|in:pending,paid,failed,refunded',
        ]);

        $order->update([
            'payment_status' => $validated['payment_status'],
        ]);

        $payment = $order->payments()->latest()->first();
        if ($payment) {
            $payment->update([
                'status' => $validated['payment_status'],
                'paid_at' => $validated['payment_status'] === 'paid' ? now() : null,
            ]);
        }

        return redirect()->back()->with('success', 'Payment status updated.');
    }

    public function updateTracking(Order $order, Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'shipping_method' => 'nullable|string|max:100',
            'tracking_number' => 'nullable|string|max:150',
        ]);

        $order->update($validated);

        return redirect()->back()->with('success', 'Shipping details updated.');
    }

    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Admin access required.');
        }
    }
}
