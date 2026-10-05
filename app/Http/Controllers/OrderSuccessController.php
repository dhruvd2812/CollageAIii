<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderSuccessController extends Controller
{
    public function __construct(protected OrderNotificationService $notificationService) {}

    public function show(string $orderNumber, Request $request): Response
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.customizations', 'items.uploads', 'statusHistories'])
            ->firstOrFail();

        // Check if user has permission to view (either guest matching session, or auth owner, or public order-success redirect with matching order)
        if ($order->user_id && $request->user() && $order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized access to this order.');
        }

        $emailPayload = $request->session()->get('emailjs_order_payload') ?? $this->notificationService->formatEmailPayload($order);

        return Inertia::render('order-success', [
            'order' => $order,
            'emailjsPayload' => $emailPayload,
        ]);
    }
}
