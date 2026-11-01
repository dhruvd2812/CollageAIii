import { Link, router, usePage } from '@inertiajs/react';
import { Filter, Search, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
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
    customer_phone: string;
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
    filters: {
        status: string;
        payment_status: string;
        q: string;
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
    return new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AdminOrdersIndex({ orders, filters }: Props) {
    const { flash } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(filters.payment_status || '');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    function applyFilters(updates: Record<string, string>) {
        const query = {
            q: searchTerm,
            status: selectedStatus,
            payment_status: selectedPaymentStatus,
            ...updates,
        };

        // Remove empty filters
        const cleanQuery: Record<string, string> = {};
        Object.entries(query).forEach(([k, v]) => {
            if (v) cleanQuery[k] = v;
        });

        router.get('/admin/orders', cleanQuery, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        applyFilters({ q: searchTerm });
    }

    function clearFilters() {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedPaymentStatus('');
        router.get('/admin/orders', {}, { preserveState: true, preserveScroll: true });
    }

    const hasActiveFilters = Boolean(searchTerm || selectedStatus || selectedPaymentStatus);

    return (
        <AdminLayout title="Orders & Fulfillment">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Orders &amp; Fulfillment</h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Search, track, and update fulfillment statuses for all customer orders.
                    </p>
                </div>
                <div className="text-xs font-bold text-neutral-600 bg-white border border-neutral-200/80 rounded-2xl px-4 py-2 shadow-xs self-start sm:self-auto">
                    Total: {orders.total} orders
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-xs mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Order #, customer name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                    </div>

                    {/* Order Status Select */}
                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        >
                            <option value="">All Order Statuses</option>
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

                    {/* Payment Status Select */}
                    <div>
                        <select
                            value={selectedPaymentStatus}
                            onChange={(e) => {
                                setSelectedPaymentStatus(e.target.value);
                                applyFilters({ payment_status: e.target.value });
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        >
                            <option value="">All Payment Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-neutral-900 text-white text-xs font-bold py-2 px-4 hover:bg-rose-600 transition"
                        >
                            Apply Filter
                        </button>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 size-9 transition shrink-0"
                                title="Reset filters"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                {orders.data.length === 0 ? (
                    <div className="text-center py-16">
                        <Filter className="size-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-neutral-500">No matching orders found</p>
                        <p className="text-xs text-neutral-400 mt-1">Try adjusting your filters or search keywords.</p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 rounded-full bg-neutral-900 text-white text-xs font-bold px-4 py-2 hover:bg-rose-600 transition"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                                    <th className="pb-3 font-bold">Order #</th>
                                    <th className="pb-3 font-bold">Customer Details</th>
                                    <th className="pb-3 font-bold">Items</th>
                                    <th className="pb-3 font-bold">Date Placed</th>
                                    <th className="pb-3 font-bold">Grand Total</th>
                                    <th className="pb-3 font-bold">Fulfillment Status</th>
                                    <th className="pb-3 font-bold">Payment</th>
                                    <th className="pb-3 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50/50 transition">
                                        <td className="py-4 font-bold text-neutral-900">{order.order_number}</td>
                                        <td className="py-4">
                                            <p className="font-bold text-neutral-900">{order.customer_name}</p>
                                            <p className="text-[10px] text-neutral-500">{order.customer_email}</p>
                                            <p className="text-[10px] text-neutral-400">{order.customer_phone}</p>
                                        </td>
                                        <td className="py-4 text-neutral-600">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </td>
                                        <td className="py-4 text-neutral-500">{formatDate(order.created_at)}</td>
                                        <td className="py-4 font-bold text-neutral-900">
                                            ₹{order.grand_total.toLocaleString('en-IN')}
                                        </td>
                                        <td className="py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                                    statusColor[order.order_status] || 'bg-neutral-100 text-neutral-700'
                                                }`}
                                            >
                                                {order.order_status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                                    paymentColor[order.payment_status] || 'bg-neutral-100 text-neutral-700'
                                                }`}
                                            >
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex rounded-xl bg-neutral-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-rose-600 transition"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-neutral-100">
                        {orders.links.map((link, i) =>
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
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

