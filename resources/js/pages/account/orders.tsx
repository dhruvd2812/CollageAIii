import { Link, usePage } from '@inertiajs/react';
import { Eye, Package } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import CustomerAccountLayout from '@/layouts/customer-account-layout';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
}

interface Order {
    id: number;
    order_number: string;
    grand_total: number;
    order_status: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    orders: {
        data: Order[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
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

export default function OrdersPage({ orders }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    return (
        <CustomerAccountLayout title="My Orders" description="View and track all your orders.">
            <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-extrabold text-neutral-900">Order History</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {orders.total} order{orders.total !== 1 ? 's' : ''} total
                        </p>
                    </div>
                </div>

                {orders.data.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="size-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-neutral-500">No orders yet</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            When you place your first order, it will appear here.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block mt-5 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => {
                            const itemNames = order.items.map((i) => i.product_name);
                            const displayNames = itemNames.slice(0, 2).join(', ');
                            const moreCount = itemNames.length - 2;

                            return (
                                <div
                                    key={order.id}
                                    className="rounded-2xl border border-neutral-100 p-5 hover:border-neutral-200 transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-sm font-extrabold text-neutral-900">
                                                    {order.order_number}
                                                </p>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${statusColor[order.order_status] || 'bg-neutral-100 text-neutral-700'}`}
                                                >
                                                    {order.order_status.replace(/_/g, ' ')}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${paymentColor[order.payment_status] || 'bg-neutral-100 text-neutral-700'}`}
                                                >
                                                    {order.payment_status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1.5">
                                                Placed on {formatDate(order.created_at)}
                                            </p>
                                            <p className="text-xs text-neutral-600 mt-1">
                                                {displayNames}
                                                {moreCount > 0 && (
                                                    <span className="text-neutral-400"> + {moreCount} more</span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <p className="text-base font-extrabold text-neutral-900">
                                                ₹{order.grand_total.toLocaleString('en-IN')}
                                            </p>
                                            <Link
                                                href={`/account/orders/${order.order_number}`}
                                                className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
                                            >
                                                <Eye className="size-3.5" />
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-neutral-100">
                        {orders.links.map((link, i) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                        link.active
                                            ? 'bg-neutral-900 text-white'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={i}
                                    className="rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-300"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
