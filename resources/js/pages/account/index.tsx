import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Heart, MapPin, Package, ShoppingBag } from 'lucide-react';
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

interface Address {
    id: number;
    label: string;
    recipient_name: string;
    line_one: string;
    city: string;
    state: string;
    postal_code: string;
}

interface Props {
    recentOrders: Order[];
    defaultAddress: Address | null;
    stats: {
        total_orders: number;
        wishlist_count: number;
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

export default function AccountDashboard({ recentOrders, defaultAddress, stats }: Props) {
    const { flash } = usePage().props as any;
    const auth = (usePage().props as any).auth || {};

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    return (
        <CustomerAccountLayout title="My Account" description="Manage your account, orders, and preferences.">
            {/* Welcome */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-neutral-900">
                    Welcome back, {auth.user?.name?.split(' ')[0] || 'there'}!
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Here's a quick overview of your account.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Link
                    href="/account/orders"
                    className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-5 hover:shadow-md transition group"
                >
                    <Package className="size-5 text-neutral-400 group-hover:text-rose-600 transition mb-2" />
                    <p className="text-2xl font-extrabold text-neutral-900">{stats.total_orders}</p>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Total Orders</p>
                </Link>
                <Link
                    href="/account/wishlist"
                    className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-5 hover:shadow-md transition group"
                >
                    <Heart className="size-5 text-neutral-400 group-hover:text-rose-600 transition mb-2" />
                    <p className="text-2xl font-extrabold text-neutral-900">{stats.wishlist_count}</p>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Wishlist</p>
                </Link>
                <Link
                    href="/account/addresses"
                    className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-5 hover:shadow-md transition group"
                >
                    <MapPin className="size-5 text-neutral-400 group-hover:text-rose-600 transition mb-2" />
                    <p className="text-2xl font-extrabold text-neutral-900">{defaultAddress ? '✓' : '—'}</p>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Address</p>
                </Link>
                <Link
                    href="/shop"
                    className="rounded-2xl bg-white border border-neutral-200/80 shadow-xs p-5 hover:shadow-md transition group"
                >
                    <ShoppingBag className="size-5 text-neutral-400 group-hover:text-rose-600 transition mb-2" />
                    <p className="text-sm font-extrabold text-neutral-900 mt-1">Browse</p>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5">Shop Now</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6 mb-8">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-extrabold text-neutral-900">Recent Orders</h3>
                    <Link
                        href="/account/orders"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                        View All <ArrowRight className="size-3.5" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-10">
                        <Package className="size-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-neutral-500">No orders yet</p>
                        <p className="text-xs text-neutral-400 mt-1">Your orders will appear here after your first purchase.</p>
                        <Link
                            href="/shop"
                            className="inline-block mt-4 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.order_number}`}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-neutral-100 p-4 hover:bg-neutral-50 transition"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-extrabold text-neutral-900">
                                        {order.order_number}
                                    </p>
                                    <p className="text-[10px] text-neutral-500 mt-0.5">
                                        {formatDate(order.created_at)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusColor[order.order_status] || 'bg-neutral-100 text-neutral-700'}`}>
                                        {order.order_status.replace(/_/g, ' ')}
                                    </span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${paymentColor[order.payment_status] || 'bg-neutral-100 text-neutral-700'}`}>
                                        {order.payment_status}
                                    </span>
                                    <span className="text-sm font-extrabold text-neutral-900">
                                        ₹{order.grand_total.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Default Address */}
            {defaultAddress && (
                <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-extrabold text-neutral-900">Default Address</h3>
                        <Link
                            href="/account/addresses"
                            className="text-xs font-bold text-rose-600 hover:text-rose-700"
                        >
                            Manage Addresses
                        </Link>
                    </div>
                    <div className="rounded-2xl border border-neutral-100 p-4">
                        <p className="text-xs font-bold text-neutral-900">{defaultAddress.recipient_name}</p>
                        <p className="text-xs text-neutral-600 mt-1">
                            {defaultAddress.line_one}, {defaultAddress.city}, {defaultAddress.state} – {defaultAddress.postal_code}
                        </p>
                        <span className="inline-block mt-2 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600">
                            {defaultAddress.label}
                        </span>
                    </div>
                </div>
            )}
        </CustomerAccountLayout>
    );
}
