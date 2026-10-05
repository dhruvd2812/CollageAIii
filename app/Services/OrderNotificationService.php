<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderNotificationRecord;
use Carbon\Carbon;

class OrderNotificationService
{
    public function createPendingNotification(Order $order, string $recipientEmail, string $type = 'owner_order_alert'): OrderNotificationRecord
    {
        $payload = $this->formatEmailPayload($order);

        return OrderNotificationRecord::create([
            'order_id' => $order->id,
            'recipient_user_id' => $order->user_id,
            'channel' => 'email',
            'notification_type' => $type,
            'recipient' => $recipientEmail,
            'provider' => 'emailjs',
            'status' => 'pending',
            'payload' => $payload,
        ]);
    }

    public function recordResult(
        int $orderId,
        string $status,
        ?string $providerMessageId = null,
        ?string $errorMessage = null,
        string $type = 'owner_order_alert'
    ): OrderNotificationRecord {
        $record = OrderNotificationRecord::where('order_id', $orderId)
            ->where('notification_type', $type)
            ->latest()
            ->first();

        if (!$record) {
            $order = Order::findOrFail($orderId);
            $record = $this->createPendingNotification($order, config('mail.from.address', 'owner@printwithdwarkesh.com'), $type);
        }

        $record->update([
            'status' => $status === 'sent' ? 'sent' : 'failed',
            'provider_message_id' => $providerMessageId,
            'failure_reason' => $errorMessage,
            'sent_at' => $status === 'sent' ? Carbon::now() : null,
            'failed_at' => $status === 'failed' ? Carbon::now() : null,
        ]);

        return $record;
    }

    public function formatEmailPayload(Order $order): array
    {
        $order->loadMissing(['items.customizations', 'items.uploads']);

        $productListLines = [];
        $customizationLines = [];

        foreach ($order->items as $idx => $item) {
            $num = $idx + 1;
            $productListLines[] = "{$num}. {$item->product_name} (Qty: {$item->quantity}) - ₹{$item->line_total}";

            $opts = [];
            foreach ($item->customizations as $cust) {
                $opts[] = "{$cust->option_name}: {$cust->display_value}";
            }
            if ($item->uploads->isNotEmpty()) {
                $files = $item->uploads->pluck('original_name')->implode(', ');
                $opts[] = "Uploaded File(s): {$files}";
            }

            if (!empty($opts)) {
                $customizationLines[] = "Item #{$num} ({$item->product_name}): " . implode(' | ', $opts);
            }
        }

        $addr = $order->shipping_address;
        $addressFormatted = is_array($addr) ? implode(', ', array_filter([
            $addr['recipient_name'] ?? '',
            $addr['line_one'] ?? '',
            $addr['line_two'] ?? '',
            $addr['landmark'] ?? '',
            $addr['city'] ?? '',
            ($addr['state'] ?? '') . ' - ' . ($addr['postal_code'] ?? ''),
            $addr['country'] ?? 'India',
            'Phone: ' . ($addr['phone'] ?? ''),
        ])) : (string) $addr;

        return [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone ?? 'N/A',
            'product_list' => implode("\n", $productListLines),
            'customization_details' => !empty($customizationLines) ? implode("\n", $customizationLines) : 'None',
            'shipping_address' => $addressFormatted,
            'subtotal' => '₹' . $order->subtotal,
            'discount' => '₹' . $order->discount_total,
            'shipping' => $order->shipping_total === 0 ? 'FREE' : '₹' . $order->shipping_total,
            'total' => '₹' . $order->grand_total,
            'payment_status' => strtoupper($order->payment_status),
            'payment_method' => $order->payment_method ?? 'Cash on Delivery / Manual',
            'order_status' => strtoupper($order->order_status),
            'order_date' => $order->created_at ? $order->created_at->format('d M Y, h:i A') : Carbon::now()->format('d M Y, h:i A'),
        ];
    }
}
