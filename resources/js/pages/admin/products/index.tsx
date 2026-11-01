import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Edit2,
    Eye,
    Filter,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from '@/layouts/admin-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    base_price: number;
    sale_price: number | null;
    effective_price: number;
    has_discount: boolean;
    manage_stock: boolean;
    stock_quantity: number;
    low_stock_threshold: number;
    status: string;
    is_featured: boolean;
    is_customizable: boolean;
    primary_image_url: string | null;
    images: ProductImage[];
    category: Category | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        q: string;
        category_id: string;
        status: string;
        stock_status: string;
    };
}

const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    inactive: 'bg-neutral-100 text-neutral-700',
    draft: 'bg-amber-100 text-amber-800',
    archived: 'bg-red-100 text-red-800',
};

export default function AdminProductsIndex({ products, categories = [], filters = { q: '', category_id: '', status: '', stock_status: '' } }: Props) {
    const { flash } = usePage().props as any;
    const [searchTerm, setSearchTerm] = useState(filters?.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedStockStatus, setSelectedStockStatus] = useState(filters?.stock_status || '');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    function applyFilters(updates: Record<string, string>) {
        const query = {
            q: searchTerm,
            category_id: selectedCategory,
            status: selectedStatus,
            stock_status: selectedStockStatus,
            ...updates,
        };

        const cleanQuery: Record<string, string> = {};
        Object.entries(query).forEach(([k, v]) => {
            if (v) cleanQuery[k] = v;
        });

        router.get('/admin/products', cleanQuery, {
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
        setSelectedCategory('');
        setSelectedStatus('');
        setSelectedStockStatus('');
        router.get('/admin/products', {}, { preserveState: true, preserveScroll: true });
    }

    function handleToggleStatus(productId: number, currentStatus: string) {
        router.patch(`/admin/products/${productId}/toggle-status`, {}, {
            preserveScroll: true,
        });
    }

    function handleDelete(productId: number, productName: string) {
        if (confirm(`Are you sure you want to remove or deactivate "${productName}"? Products associated with orders will be safely deactivated.`)) {
            router.delete(`/admin/products/${productId}`, {
                preserveScroll: true,
            });
        }
    }

    const hasActiveFilters = Boolean(searchTerm || selectedCategory || selectedStatus || selectedStockStatus);

    return (
        <AdminLayout title="Products Management">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Products Management</h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Catalog overview, inventory quantities, prices, custom options, and statuses.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-neutral-600 bg-white border border-neutral-200/80 rounded-2xl px-4 py-2 shadow-xs">
                        Total: {products.total} products
                    </span>
                    <Link
                        href="/admin/products/create"
                        className="flex items-center gap-1.5 rounded-2xl bg-neutral-900 text-white px-4 py-2 text-xs font-bold hover:bg-rose-600 transition shadow-xs"
                    >
                        <Plus className="size-4" /> Add Product
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 p-5 shadow-xs mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Name, SKU, keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                applyFilters({ category_id: e.target.value });
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Stock Status */}
                    <div>
                        <select
                            value={selectedStockStatus}
                            onChange={(e) => {
                                setSelectedStockStatus(e.target.value);
                                applyFilters({ stock_status: e.target.value });
                            }}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        >
                            <option value="">All Stock Levels</option>
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock (0)</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-neutral-900 text-white text-xs font-bold py-2 px-3 hover:bg-rose-600 transition"
                        >
                            Filter
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

            {/* Products Table */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs">
                {products.data.length === 0 ? (
                    <div className="text-center py-16">
                        <Filter className="size-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-neutral-500">No matching products found</p>
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
                                    <th className="pb-3 font-bold">Image</th>
                                    <th className="pb-3 font-bold">Product Name &amp; SKU</th>
                                    <th className="pb-3 font-bold">Category</th>
                                    <th className="pb-3 font-bold">Price (₹)</th>
                                    <th className="pb-3 font-bold">Stock</th>
                                    <th className="pb-3 font-bold">Status</th>
                                    <th className="pb-3 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {products.data.map((prod) => {
                                    const imgUrl = prod.primary_image_url || prod.images?.[0]?.url;
                                    const isOutOfStock = prod.manage_stock && prod.stock_quantity <= 0;
                                    const isLowStock = prod.manage_stock && prod.stock_quantity > 0 && prod.stock_quantity <= prod.low_stock_threshold;

                                    return (
                                        <tr key={prod.id} className="hover:bg-neutral-50/50 transition">
                                            {/* Thumbnail */}
                                            <td className="py-3.5 pr-3">
                                                <div className="size-12 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center shrink-0">
                                                    {imgUrl ? (
                                                        <img
                                                            src={imgUrl}
                                                            alt={prod.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="size-5 text-neutral-300" />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Name & SKU */}
                                            <td className="py-3.5 max-w-xs">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className="font-bold text-neutral-900">{prod.name}</p>
                                                    {prod.is_customizable && (
                                                        <span className="rounded-md bg-rose-50 text-rose-600 border border-rose-200/60 px-1.5 py-0.2 text-[9px] font-bold">
                                                            Customizable
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">SKU: {prod.sku}</p>
                                            </td>

                                            {/* Category */}
                                            <td className="py-3.5 font-medium text-neutral-600">
                                                {prod.category?.name || 'Uncategorized'}
                                            </td>

                                            {/* Pricing */}
                                            <td className="py-3.5">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="font-extrabold text-neutral-900">
                                                        ₹{prod.effective_price.toLocaleString('en-IN')}
                                                    </span>
                                                    {prod.has_discount && (
                                                        <span className="text-[10px] text-neutral-400 line-through">
                                                            ₹{prod.base_price.toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="py-3.5">
                                                {prod.manage_stock ? (
                                                    <div>
                                                        <span
                                                            className={`font-bold ${
                                                                isOutOfStock
                                                                    ? 'text-red-600'
                                                                    : isLowStock
                                                                    ? 'text-amber-600'
                                                                    : 'text-neutral-900'
                                                            }`}
                                                        >
                                                            {prod.stock_quantity} units
                                                        </span>
                                                        {isOutOfStock && (
                                                            <span className="block text-[9px] font-extrabold uppercase text-red-600">
                                                                Out of Stock
                                                            </span>
                                                        )}
                                                        {isLowStock && (
                                                            <span className="block text-[9px] font-bold text-amber-600">
                                                                Low Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-400 text-[11px]">Unlimited</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5">
                                                <button
                                                    onClick={() => handleToggleStatus(prod.id, prod.status)}
                                                    title="Click to toggle status"
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize transition hover:opacity-80 ${
                                                        statusColors[prod.status] || 'bg-neutral-100 text-neutral-700'
                                                    }`}
                                                >
                                                    {prod.status}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 text-right">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Link
                                                        href={`/product/${prod.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition"
                                                        title="Preview on Storefront"
                                                    >
                                                        <Eye className="size-3.5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${prod.id}/edit`}
                                                        className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 transition"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(prod.id, prod.name)}
                                                        className="p-1.5 rounded-lg bg-neutral-100 text-neutral-500 hover:text-red-600 hover:bg-red-50 transition"
                                                        title="Delete or Deactivate"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-neutral-100">
                        {products.links.map((link, i) =>
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

