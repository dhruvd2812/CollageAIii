import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, Download, Package, Truck } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import CustomerAccountLayout from '@/layouts/customer-account-layout';

interface Customization {
    id: number;
    option_label: string;
    value_label: string;
}

interface Upload {
    id: number;
    file_name: string;
    file_url: string;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
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
    review: Review | null;
}

interface StatusHistory {
    id: number;
    from_status: string;
    to_status: string;
    note: string;
    created_at: string;
    user: { name: string } | null;
}

interface Payment {
    id: number;
    method: string;
    status: string;
    amount: number;
    paid_at: string | null;
}

interface ShippingAddress {
    line_one: string;
    line_two?: string;
    landmark?: string;
    city: string;
    state: string;
    postal_code: string;
    country_code?: string;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: ShippingAddress;
    subtotal: number;
    discount_amount: number;
    shipping_fee: number;
    grand_total: number;
    order_status: string;
    payment_status: string;
    shipping_method: string | null;
    tracking_number: string | null;
    created_at: string;
    items: OrderItem[];
    status_histories: StatusHistory[];
    payments: Payment[];
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

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(d: string) {
    return new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

export default function OrderDetailPage({ order }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const addr = order.shipping_address;

    return (
        <CustomerAccountLayout title={`Order ${order.order_number}`} description="View your order details.">
            {/* Back link */}
            <Link
                href="/account/orders"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition mb-6"
            >
                <ArrowLeft className="size-3.5" /> Back to Orders
            </Link>

            {/* Order Header */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-neutral-900">{order.order_number}</h2>
                        <p className="text-xs text-neutral-500 mt-1">Placed on {formatDateTime(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColor[order.order_status] || 'bg-neutral-100 text-neutral-700'}`}>
                            {order.order_status.replace(/_/g, ' ')}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${paymentColor[order.payment_status] || 'bg-neutral-100 text-neutral-700'}`}>
                            {order.payment_status}
                        </span>
                    </div>
                </div>

                {/* Tracking info */}
                {order.tracking_number && (
                    <div className="mt-4 rounded-2xl bg-neutral-50 border border-neutral-100 p-4 flex items-center gap-3">
                        <Truck className="size-5 text-neutral-500" />
                        <div>
                            <p className="text-xs font-bold text-neutral-700">
                                {order.shipping_method || 'Standard Shipping'}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Tracking: <span className="font-mono font-bold">{order.tracking_number}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column — Items + Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                        <h3 className="text-base font-extrabold text-neutral-900 mb-5">Items Ordered</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-neutral-100 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.product_slug}`}
                                                className="text-sm font-bold text-neutral-900 hover:text-rose-600 transition"
                                            >
                                                {item.product_name}
                                            </Link>

                                            {/* Customizations */}
                                            {item.customizations.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {item.customizations.map((c) => (
                                                        <span key={c.id} className="rounded-lg bg-neutral-50 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                                                            {c.option_label}: {c.value_label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Uploads */}
                                            {item.uploads.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {item.uploads.map((u) => (
                                                        <a
                                                            key={u.id}
                                                            href={u.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-700"
                                                        >
                                                            <Download className="size-3" /> {u.file_name}
                                                        </a>
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

                    {/* Status Timeline */}
                    {order.status_histories.length > 0 && (
                        <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                            <h3 className="text-base font-extrabold text-neutral-900 mb-5">Order Timeline</h3>
                            <div className="relative pl-6 space-y-6">
                                <div className="absolute left-[9px] top-1 bottom-1 w-px bg-neutral-200" />
                                {order.status_histories.map((h, i) => (
                                    <div key={h.id} className="relative">
                                        <div className={`absolute -left-6 top-0.5 size-[18px] rounded-full border-2 flex items-center justify-center ${
                                            i === order.status_histories.length - 1
                                                ? 'border-rose-500 bg-rose-500'
                                                : 'border-neutral-300 bg-white'
                                        }`}>
                                            {i === order.status_histories.length - 1 && (
                                                <CheckCircle className="size-3 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-neutral-900 capitalize">
                                                {h.from_status.replace(/_/g, ' ')} → {h.to_status.replace(/_/g, ' ')}
                                            </p>
                                            {h.note && (
                                                <p className="text-[11px] text-neutral-600 mt-0.5">{h.note}</p>
                                            )}
                                            <p className="text-[10px] text-neutral-400 mt-1">
                                                {formatDateTime(h.created_at)}
                                                {h.user && <span> · by {h.user.name}</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column — Summary, Address, Payment */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                        <h3 className="text-base font-extrabold text-neutral-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Subtotal</span>
                                <span className="font-bold text-neutral-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-emerald-700">
                                    <span>Discount</span>
                                    <span className="font-bold">−₹{order.discount_amount.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Shipping</span>
                                <span className="font-bold text-neutral-900">
                                    {order.shipping_fee === 0 ? 'Free' : `₹${order.shipping_fee.toLocaleString('en-IN')}`}
                                </span>
                            </div>
                            <div className="border-t border-neutral-100 pt-2 mt-2 flex justify-between">
                                <span className="font-extrabold text-neutral-900">Grand Total</span>
                                <span className="font-extrabold text-neutral-900 text-base">
                                    ₹{order.grand_total.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                        <h3 className="text-base font-extrabold text-neutral-900 mb-4">Shipping Address</h3>
                        <div className="text-xs text-neutral-700 space-y-0.5">
                            <p className="font-bold text-neutral-900">{order.customer_name}</p>
                            <p>{addr?.line_one}</p>
                            {addr?.line_two && <p>{addr.line_two}</p>}
                            {addr?.landmark && <p>Near {addr.landmark}</p>}
                            <p>{addr?.city}, {addr?.state} – {addr?.postal_code}</p>
                            <p className="mt-2 text-neutral-500">{order.customer_phone}</p>
                            <p className="text-neutral-500">{order.customer_email}</p>
                        </div>
                    </div>

                    {/* Payment */}
                    {order.payments.length > 0 && (
                        <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                            <h3 className="text-base font-extrabold text-neutral-900 mb-4">Payment</h3>
                            {order.payments.map((p) => (
                                <div key={p.id} className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Method</span>
                                        <span className="font-bold text-neutral-900 capitalize">{p.method.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Status</span>
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${paymentColor[p.status] || 'bg-neutral-100 text-neutral-700'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Amount</span>
                                        <span className="font-bold text-neutral-900">₹{p.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                    {p.paid_at && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Paid</span>
                                            <span className="text-neutral-600">{formatDateTime(p.paid_at)}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerAccountLayout>
    );
}
