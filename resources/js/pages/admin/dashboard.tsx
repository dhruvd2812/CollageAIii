import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Clock, IndianRupee, Package, Star, Users } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import AdminLayout from '@/layouts/admin-layout';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    grand_total: number;
    order_status: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
}

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: {
        name: string;
    } | null;
    product: {
        name: string;
        slug: string;
    } | null;
}

interface Props {
    stats: {
        total_revenue: number;
        total_orders: number;
        pending_orders: number;
        total_customers: number;
    };
    recentOrders: Order[];
    recentReviews: Review[];
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
    return new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function AdminDashboard({ stats, recentOrders = [], recentReviews = [] }: Props) {
    const { flash } = usePage().props as any;

    const safeStats = {
        total_revenue: stats?.total_revenue ?? 0,
        total_orders: stats?.total_orders ?? 0,
        pending_orders: stats?.pending_orders ?? 0,
        total_customers: stats?.total_customers ?? 0,
    };
    const safeOrders = Array.isArray(recentOrders) ? recentOrders : [];
    const safeReviews = Array.isArray(recentReviews) ? recentReviews : [];

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AdminLayout title="Dashboard">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-xs text-neutral-500 mt-1">
                    Store performance, order management, and recent customer interactions.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            Total Revenue
                        </span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <IndianRupee className="size-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-neutral-900 mt-3">
                        ₹{Number(safeStats.total_revenue).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">Paid orders sum</p>
                </div>

                <div className="rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            Total Orders
                        </span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Package className="size-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-neutral-900 mt-3">{safeStats.total_orders}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">Lifetime customer orders</p>
                </div>

                <div className="rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            Pending Orders
                        </span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock className="size-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-neutral-900 mt-3">{safeStats.pending_orders}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">Needs action / fulfillment</p>
                </div>

                <div className="rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            Customers
                        </span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Users className="size-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-extrabold text-neutral-900 mt-3">{safeStats.total_customers}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">Registered accounts</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-extrabold text-neutral-900">Recent Orders</h2>
                            <p className="text-xs text-neutral-500">Latest customer orders</p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                        >
                            All Orders <ArrowRight className="size-3.5" />
                        </Link>
                    </div>

                    {safeOrders.length === 0 ? (
                        <p className="text-xs text-neutral-500 py-6 text-center">No orders found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 font-bold">Order #</th>
                                        <th className="pb-3 font-bold">Customer</th>
                                        <th className="pb-3 font-bold">Date</th>
                                        <th className="pb-3 font-bold">Total</th>
                                        <th className="pb-3 font-bold">Status</th>
                                        <th className="pb-3 font-bold">Payment</th>
                                        <th className="pb-3 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {safeOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-neutral-50/50 transition">
                                            <td className="py-3.5 font-bold text-neutral-900">{order.order_number}</td>
                                            <td className="py-3.5">
                                                <p className="font-bold text-neutral-800">{order.customer_name}</p>
                                                <p className="text-[10px] text-neutral-400">{order.customer_email}</p>
                                            </td>
                                            <td className="py-3.5 text-neutral-500">{formatDate(order.created_at)}</td>
                                            <td className="py-3.5 font-bold text-neutral-900">
                                                ₹{Number(order.grand_total ?? 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3.5">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                                                        statusColor[order.order_status] || 'bg-neutral-100 text-neutral-700'
                                                    }`}
                                                >
                                                    {order.order_status?.replace(/_/g, ' ') || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3.5">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                                                        paymentColor[order.payment_status] || 'bg-neutral-100 text-neutral-700'
                                                    }`}
                                                >
                                                    {order.payment_status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex rounded-lg bg-neutral-100 px-2.5 py-1 text-[11px] font-bold text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent Reviews */}
                <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                    <h2 className="text-base font-extrabold text-neutral-900 mb-1">Recent Reviews</h2>
                    <p className="text-xs text-neutral-500 mb-5">Latest customer feedback</p>

                    {safeReviews.length === 0 ? (
                        <p className="text-xs text-neutral-500 py-6 text-center">No reviews submitted yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {safeReviews.map((rev) => (
                                <div key={rev.id} className="rounded-2xl border border-neutral-100 p-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-xs font-bold text-neutral-900">
                                            {rev.user?.name || 'Customer'}
                                        </p>
                                        <div className="flex items-center gap-0.5 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`size-3 ${
                                                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {rev.product && (
                                        <p className="text-[11px] font-bold text-neutral-500 mb-1">
                                            On {rev.product.name}
                                        </p>
                                    )}
                                    {rev.comment && (
                                        <p className="text-xs text-neutral-600 italic line-clamp-3">"{rev.comment}"</p>
                                    )}
                                    <p className="text-[10px] text-neutral-400 mt-2">{formatDate(rev.created_at)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

