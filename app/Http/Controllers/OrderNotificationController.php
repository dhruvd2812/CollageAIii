<?php

namespace App\Http\Controllers;

use App\Services\OrderNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderNotificationController extends Controller
{
    public function __construct(protected OrderNotificationService $notificationService) {}

    public function recordBrowserEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'status' => 'required|in:sent,failed',
            'provider_message_id' => 'nullable|string|max:191',
            'error_message' => 'nullable|string|max:1000',
            'notification_type' => 'nullable|string|in:owner_order_alert,owner_order_cancellation|max:100',
        ]);

        $order = \App\Models\Order::findOrFail($validated['order_id']);
        if (!$request->user() || (!$request->user()->isAdmin() && $order->user_id !== $request->user()->id)) {
            abort(403);
        }

        $record = $this->notificationService->recordResult(
            (int) $validated['order_id'],
            $validated['status'],
            $validated['provider_message_id'] ?? null,
            $validated['error_message'] ?? null,
            $validated['notification_type'] ?? 'owner_order_alert'
        );

        return response()->json([
            'success' => true,
            'record_id' => $record->id,
            'status' => $record->status,
        ]);
    }
}
