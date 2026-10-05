import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle,
    Clock,
    Download,
    Mail,
    MapPin,
    Package,
    Printer,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import StoreLayout from '@/layouts/store-layout';
import { OrderEmailPayload, sendOrderNotificationEmail } from '@/lib/emailjs';

interface OrderSuccessProps {
    order: {
        id: number;
        order_number: string;
        customer_name: string;
        customer_email: string;
        customer_phone?: string;
        subtotal: number;
        discount_total: number;
        shipping_total: number;
        grand_total: number;
        order_status: string;
        payment_status: string;
        payment_method: string;
        shipping_method: string;
        shipping_address: any;
        created_at: string;
        items: Array<{
            id: number;
            product_name: string;
            product_sku?: string;
            product_image_path?: string;
            quantity: number;
            unit_price: number;
            line_total: number;
            customizations?: Array<{
                option_name: string;
                display_value: string;
            }>;
            uploads?: Array<{
                id: number;
                original_name: string;
                url: string;
                is_image: boolean;
            }>;
        }>;
    };
    emailjsPayload?: OrderEmailPayload;
}

export default function OrderSuccessPage({ order, emailjsPayload }: OrderSuccessProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};

    const [emailStatus, setEmailStatus] = useState<'pending' | 'sent' | 'failed' | 'not_configured'>('pending');
    const [statusMessage, setStatusMessage] = useState('Dispatching order notification to studio...');

    useEffect(() => {
        if (emailjsPayload) {
            sendOrderNotificationEmail(emailjsPayload).then((res) => {
                if (res.success) {
                    setEmailStatus('sent');
                    setStatusMessage('Order notification email sent to store owner via EmailJS.');
                } else if (res.notConfigured) {
                    setEmailStatus('not_configured');
                    setStatusMessage('EmailJS configured in development mode (see docs/EMAILJS_SETUP.md).');
                } else {
                    setEmailStatus('failed');
                    setStatusMessage('Order saved securely in database (EmailJS notification logged).');
                }
            });
        }
    }, [emailjsPayload]);

    const addr = order.shipping_address || {};

    return (
        <StoreLayout
            title={`Order Confirmed #${order.order_number}`}
            description="Thank you for your custom print order with PRINTWITHDWARKESH."
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Banner */}
                <div className="rounded-3xl bg-white p-8 sm:p-12 border border-neutral-200 shadow-sm text-center space-y-4">
                    <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                        <Check className="size-8 stroke-[3]" />
                    </div>

                    <span className="inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-600 border border-rose-200">
                        Order Received & Queued
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950">
                        Thank You, {order.customer_name}!
                    </h1>

                    <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                        Your custom print order has been placed. We have queued your files for ultra-HD printing and quality review.
                    </p>

                    <div className="inline-flex items-center gap-2 rounded-2xl bg-neutral-50 px-5 py-2.5 border border-neutral-200 text-xs font-bold text-neutral-800">
                        <span>Order Number:</span>
                        <span className="font-mono text-rose-600 text-sm">{order.order_number}</span>
                    </div>

                    {/* EmailJS Status Indicator */}
                    <div className="pt-2">
                        <div
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${
                                emailStatus === 'sent'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : emailStatus === 'not_configured'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-neutral-100 text-neutral-600'
                            }`}
                        >
                            <Mail className="size-3.5" />
                            <span>{statusMessage}</span>
                        </div>
                    </div>
                </div>

                {/* Order Details & Summary Card */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Items & Options List */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                            <h2 className="font-extrabold text-base text-neutral-950 flex items-center gap-2">
                                <Package className="size-5 text-rose-600" />
                                <span>Ordered Items ({order.items.length})</span>
                            </h2>

                            <div className="divide-y divide-neutral-100 space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="pt-4 first:pt-0 space-y-2">
                                        <div className="flex justify-between items-start text-xs">
                                            <div>
                                                <h3 className="font-bold text-sm text-neutral-900">{item.product_name}</h3>
                                                <p className="text-neutral-500">Qty: {item.quantity} × ₹{item.unit_price}</p>
                                            </div>
                                            <span className="font-extrabold text-neutral-900 text-sm">
                                                ₹{item.line_total}
                                            </span>
                                        </div>

                                        {/* Customizations */}
                                        {item.customizations && item.customizations.length > 0 && (
                                            <div className="rounded-xl bg-neutral-50 p-3 text-[11px] text-neutral-600 space-y-0.5 border border-neutral-200/60">
                                                {item.customizations.map((c, i) => (
                                                    <p key={i}>
                                                        <span className="font-bold text-neutral-800">{c.option_name}:</span> {c.display_value}
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {/* Uploaded Design Reference */}
                                        {item.uploads && item.uploads.length > 0 && (
                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                                                <Check className="size-3.5" />
                                                <span>Custom Artwork: {item.uploads[0].original_name}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="md:col-span-5 space-y-6">
                        {/* Delivery Address */}
                        <div className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-xs space-y-3">
                            <h3 className="font-extrabold text-sm text-neutral-950 flex items-center gap-2">
                                <MapPin className="size-4 text-rose-600" />
                                <span>Delivery Address</span>
                            </h3>
                            <div className="text-xs text-neutral-600 space-y-1">
                                <p className="font-bold text-neutral-900">{addr.recipient_name || order.customer_name}</p>
                                <p>{addr.line_one}</p>
                                {addr.line_two && <p>{addr.line_two}</p>}
                                <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                                <p className="pt-1">📞 {addr.phone || order.customer_phone}</p>
                            </div>
                        </div>

                        {/* Financial Totals */}
                        <div className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-xs space-y-3">
                            <h3 className="font-extrabold text-sm text-neutral-950">Payment Summary</h3>
                            <div className="space-y-1.5 text-xs text-neutral-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-neutral-900">₹{order.subtotal}</span>
                                </div>
                                {order.discount_total > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-semibold">
                                        <span>Discount</span>
                                        <span>-₹{order.discount_total}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-neutral-900">
                                        {order.shipping_total === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.shipping_total}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
                                    <span>Total Paid</span>
                                    <span>₹{order.grand_total}</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <span className="text-[11px] font-bold text-neutral-500 block">
                                    Payment Method: <span className="text-neutral-900">{order.payment_method}</span>
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            {auth.user ? (
                                <Link
                                    href={`/account/orders/${order.order_number}`}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-3.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
                                >
                                    <span>Track in Customer Account</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <Link
                                    href="/register"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-3.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
                                >
                                    <span>Create Account to Track Orders</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            )}
                            <Link
                                href="/shop"
                                className="w-full inline-flex items-center justify-center rounded-full border border-neutral-300 py-3 text-xs font-bold text-neutral-700 hover:bg-white transition"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
