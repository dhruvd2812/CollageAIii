import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    FileText,
    Mail,
    MapPin,
    Package,
    Shield,
    Truck,
    User,
} from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';
import AdminLayout from '@/layouts/admin-layout';

interface Customization {
    id: number;
    option_label: string;
    value_label: string;
}

interface Upload {
    id: number;
    file_name: string;
    file_url: string;
    file_size_bytes?: number;
    mime_type?: string;
}

interface OrderItem {
    id: number;
    product_name: string;
    product_slug: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    customizations: Customization[];
    uploads: Upload[];
}

interface StatusHistory {
    id: number;
    from_status: string;
    to_status: string;
    note: string | null;
    created_at: string;
    user: {
        name: string;
    } | null;
}

interface Payment {
    id: number;
    method: string;
    status: string;
    amount: number;
    paid_at: string | null;
    provider_reference: string | null;
}

interface NotificationRecord {
    id: number;
    recipient: string;
    status: string;
    notification_type: string;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: {
        line_one: string;
        line_two?: string;
        landmark?: string;
        city: string;
        state: string;
        postal_code: string;
        country_code?: string;
    };
    subtotal: number;
    discount_amount: number;
    shipping_fee: number;
    grand_total: number;
    order_status: string;
    payment_status: string;
    shipping_method: string | null;
    tracking_number: string | null;
    admin_notes: string | null;
    created_at: string;
    items: OrderItem[];
    status_histories: StatusHistory[];
    payments: Payment[];
    notifications: NotificationRecord[];
}

interface Props {
    order: Order;
}

const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-sky-100 text-sky-800',
    processing: 'bg-blue-100 text-blue-800',
    design_review: 'bg-violet-100 text-violet-800',
    printing: 'bg-indigo-100 text-indigo-800',
    ready_to_ship: 'bg-cyan-100 text-cyan-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
};

const paymentColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    paid: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
};

function formatDateTime(d: string) {
    return new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AdminOrderShow({ order }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Form 1: Order Status Form
    const statusForm = useForm({
        order_status: order.order_status,
        note: '',
    });

    function handleUpdateStatus(e: FormEvent) {
        e.preventDefault();
        statusForm.put(`/admin/orders/${order.id}/status`, {
            preserveScroll: true,
            onSuccess: () => statusForm.reset('note'),
        });
    }

    // Form 2: Payment Status Form
    const paymentForm = useForm({
        payment_status: order.payment_status,
    });

    function handleUpdatePayment(e: FormEvent) {
        e.preventDefault();
        paymentForm.put(`/admin/orders/${order.id}/payment`, {
            preserveScroll: true,
        });
    }

    // Form 3: Tracking Form
    const trackingForm = useForm({
        shipping_method: order.shipping_method || '',
        tracking_number: order.tracking_number || '',
    });

    function handleUpdateTracking(e: FormEvent) {
        e.preventDefault();
        trackingForm.put(`/admin/orders/${order.id}/tracking`, {
            preserveScroll: true,
        });
    }

    const addr = order.shipping_address;

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            {/* Header & Back link */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/orders"
                        className="flex size-9 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs transition"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                                {order.order_number}
                            </h1>
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                    statusColor[order.order_status] || 'bg-neutral-100 text-neutral-700'
                                }`}
                            >
                                {order.order_status.replace(/_/g, ' ')}
                            </span>
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                    paymentColor[order.payment_status] || 'bg-neutral-100 text-neutral-700'
                                }`}
                            >
                                {order.payment_status}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">Placed on {formatDateTime(order.created_at)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left (2 Columns) — Items, Uploads, Timeline, Notifications */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Card */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-extrabold text-neutral-900">Ordered Products</h2>
                            <span className="text-xs font-bold text-neutral-500">{order.items.length} items</span>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-neutral-100 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-neutral-900">{item.product_name}</p>

                                            {/* Customizations */}
                                            {item.customizations.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {item.customizations.map((c) => (
                                                        <span
                                                            key={c.id}
                                                            className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700"
                                                        >
                                                            {c.option_label}: {c.value_label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Uploaded Files */}
                                            {item.uploads.length > 0 && (
                                                <div className="mt-3 rounded-xl bg-amber-50/60 border border-amber-100 p-3 space-y-1.5">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                                        Customer Uploaded Artwork:
                                                    </p>
                                                    {item.uploads.map((u) => (
                                                        <div
                                                            key={u.id}
                                                            className="flex items-center justify-between text-xs"
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <FileText className="size-3.5 text-amber-600 shrink-0" />
                                                                <span className="truncate font-medium text-neutral-800">
                                                                    {u.file_name}
                                                                </span>
                                                            </div>
                                                            <a
                                                                href={u.file_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 ml-3 shrink-0"
                                                            >
                                                                <Download className="size-3" /> View / Download
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                ₹{item.unit_price.toLocaleString('en-IN')} each
                                            </p>
                                            <p className="text-sm font-extrabold text-neutral-900 mt-1">
                                                ₹{item.line_total.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status History Timeline */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-5">Order Status Audit Trail</h2>
                        {order.status_histories.length === 0 ? (
                            <p className="text-xs text-neutral-500">No status updates logged yet.</p>
                        ) : (
                            <div className="relative pl-6 space-y-6">
                                <div className="absolute left-[9px] top-1 bottom-1 w-px bg-neutral-200" />
                                {order.status_histories.map((h, i) => (
                                    <div key={h.id} className="relative">
                                        <div
                                            className={`absolute -left-6 top-0.5 size-[18px] rounded-full border-2 flex items-center justify-center ${
                                                i === order.status_histories.length - 1
                                                    ? 'border-rose-500 bg-rose-500'
                                                    : 'border-neutral-300 bg-white'
                                            }`}
                                        >
                                            {i === order.status_histories.length - 1 && (
                                                <CheckCircle className="size-3 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-neutral-900 capitalize">
                                                    {h.from_status.replace(/_/g, ' ')} → {h.to_status.replace(/_/g, ' ')}
                                                </p>
                                                {h.user && (
                                                    <span className="text-[10px] text-neutral-400">
                                                        by {h.user.name}
                                                    </span>
                                                )}
                                            </div>
                                            {h.note && (
                                                <p className="text-[11px] text-neutral-600 mt-0.5">{h.note}</p>
                                            )}
                                            <p className="text-[10px] text-neutral-400 mt-1">
                                                {formatDateTime(h.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* EmailJS Notifications Dispatched */}
                    {order.notifications.length > 0 && (
                        <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                            <h2 className="text-base font-extrabold text-neutral-900 mb-4">Dispatched Notifications</h2>
                            <div className="space-y-2">
                                {order.notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className="flex items-center justify-between text-xs p-3 rounded-xl bg-neutral-50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Mail className="size-3.5 text-neutral-500" />
                                            <span className="font-bold text-neutral-800">{n.notification_type}</span>
                                            <span className="text-neutral-500">to {n.recipient}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    n.status === 'sent'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                {n.status}
                                            </span>
                                            <span className="text-[10px] text-neutral-400">
                                                {formatDateTime(n.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right (1 Column) — Actions & Customer Details */}
                <div className="space-y-6">
                    {/* Action 1: Update Fulfillment Status */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-4">Update Order Status</h2>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                                    Fulfillment Status
                                </label>
                                <select
                                    value={statusForm.data.order_status}
                                    onChange={(e) => statusForm.setData('order_status', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="design_review">Design Review</option>
                                    <option value="printing">Printing</option>
                                    <option value="ready_to_ship">Ready to Ship</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                                    Status Change Note (Internal / Customer)
                                </label>
                                <textarea
                                    value={statusForm.data.note}
                                    onChange={(e) => statusForm.setData('note', e.target.value)}
                                    placeholder="Add details about this status update..."
                                    rows={2}
                                    className="w-full text-xs rounded-xl border border-neutral-200 p-3 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={statusForm.processing}
                                className="w-full rounded-xl bg-neutral-900 text-white text-xs font-bold py-2.5 hover:bg-rose-600 transition disabled:opacity-50"
                            >
                                {statusForm.processing ? 'Saving...' : 'Update Status'}
                            </button>
                        </form>
                    </div>

                    {/* Action 2: Update Payment Status */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-4">Update Payment Status</h2>
                        <form onSubmit={handleUpdatePayment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                                    Payment Condition
                                </label>
                                <select
                                    value={paymentForm.data.payment_status}
                                    onChange={(e) => paymentForm.setData('payment_status', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={paymentForm.processing}
                                className="w-full rounded-xl bg-neutral-900 text-white text-xs font-bold py-2.5 hover:bg-rose-600 transition disabled:opacity-50"
                            >
                                {paymentForm.processing ? 'Saving...' : 'Update Payment'}
                            </button>
                        </form>
                    </div>

                    {/* Action 3: Courier Tracking */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-4">Shipping &amp; Tracking</h2>
                        <form onSubmit={handleUpdateTracking} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Courier Partner</label>
                                <input
                                    type="text"
                                    placeholder="e.g. BlueDart, Delhivery, DTDC"
                                    value={trackingForm.data.shipping_method}
                                    onChange={(e) => trackingForm.setData('shipping_method', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">AWB / Tracking Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1234567890"
                                    value={trackingForm.data.tracking_number}
                                    onChange={(e) => trackingForm.setData('tracking_number', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={trackingForm.processing}
                                className="w-full rounded-xl bg-neutral-900 text-white text-xs font-bold py-2.5 hover:bg-rose-600 transition disabled:opacity-50"
                            >
                                {trackingForm.processing ? 'Saving...' : 'Save Tracking Info'}
                            </button>
                        </form>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-4">Customer &amp; Shipping</h2>
                        <div className="text-xs space-y-3">
                            <div>
                                <p className="font-bold text-neutral-900">{order.customer_name}</p>
                                <p className="text-neutral-500">{order.customer_email}</p>
                                <p className="text-neutral-500">{order.customer_phone}</p>
                            </div>

                            <div className="border-t border-neutral-100 pt-3">
                                <p className="font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                                    <MapPin className="size-3.5 text-neutral-400" /> Delivery Address
                                </p>
                                <p className="text-neutral-600">{addr?.line_one}</p>
                                {addr?.line_two && <p className="text-neutral-600">{addr.line_two}</p>}
                                {addr?.landmark && <p className="text-neutral-500">Near: {addr.landmark}</p>}
                                <p className="text-neutral-600">
                                    {addr?.city}, {addr?.state} - {addr?.postal_code}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-4">Order Financials</h2>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Subtotal</span>
                                <span className="font-bold text-neutral-900">
                                    ₹{order.subtotal.toLocaleString('en-IN')}
                                </span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-emerald-700">
                                    <span>Discount Applied</span>
                                    <span className="font-bold">
                                        −₹{order.discount_amount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Shipping Charges</span>
                                <span className="font-bold text-neutral-900">
                                    {order.shipping_fee === 0 ? 'Free' : `₹${order.shipping_fee.toLocaleString('en-IN')}`}
                                </span>
                            </div>
                            <div className="border-t border-neutral-100 pt-2.5 mt-2.5 flex justify-between">
                                <span className="font-extrabold text-neutral-900">Grand Total</span>
                                <span className="font-extrabold text-base text-neutral-900">
                                    ₹{order.grand_total.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

