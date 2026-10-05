import { Link, router } from '@inertiajs/react';
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store-layout';

interface ShopIndexProps {
    products: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    filters: {
        category?: string;
        min_price?: string;
        max_price?: string;
        q?: string;
        sort?: string;
    };
}

export default function ShopIndex({ products, categories = [], filters = {} }: ShopIndexProps) {
    const [filterCategory, setFilterCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'featured');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const applyFilters = (newOverrides: Record<string, any> = {}) => {
        const queryParams: Record<string, any> = {
            category: filterCategory,
            min_price: minPrice,
            max_price: maxPrice,
            q: searchQuery,
            sort: sortBy,
            ...newOverrides,
        };

        // Clean empty keys
        Object.keys(queryParams).forEach((k) => {
            if (!queryParams[k]) delete queryParams[k];
        });

        router.get('/shop', queryParams, { preserveState: true });
    };

    const handleReset = () => {
        setFilterCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSearchQuery('');
        setSortBy('featured');
        router.get('/shop');
    };

    return (
        <StoreLayout
            title="Shop Custom Prints & Products"
            description="Explore our complete catalog of custom posters, ceramic mugs, insulated bottles, cotton tees, and luxury visiting cards."
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Title & Sorting Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200/80 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                            All Custom Products
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                            Showing {products.total} bespoke items handcrafted for your home and brand.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Toggle Button */}
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-800"
                        >
                            <SlidersHorizontal className="size-3.5" />
                            <span>Filters</span>
                        </button>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-500 hidden sm:inline">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    applyFilters({ sort: e.target.value });
                                }}
                                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-800 focus:border-rose-500 focus:outline-none"
                            >
                                <option value="featured">Featured First</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-xs space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-neutral-900 text-sm">Filters</h3>
                                {(filterCategory || minPrice || maxPrice || searchQuery) && (
                                    <button
                                        onClick={handleReset}
                                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                                    >
                                        <RotateCcw className="size-3" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>

                            {/* Search filter input */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-2">Search Catalog</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        placeholder="Keywords..."
                                        className="w-full rounded-2xl bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => applyFilters()}
                                        className="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-700"
                                    >
                                        <Search className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-2">Categories</label>
                                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFilterCategory('');
                                            applyFilters({ category: '' });
                                        }}
                                        className={`w-full text-left rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                            filterCategory === ''
                                                ? 'bg-neutral-900 text-white font-bold'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setFilterCategory(cat.slug);
                                                applyFilters({ category: cat.slug });
                                            }}
                                            className={`w-full text-left rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                                filterCategory === cat.slug
                                                    ? 'bg-neutral-900 text-white font-bold'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-2">Price Range (₹)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-1.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-1.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => applyFilters()}
                                    className="mt-3 w-full rounded-full bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
                                >
                                    Apply Price Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="lg:col-span-9">
                        {products.data.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
                                <Search className="size-12 mx-auto text-neutral-300" />
                                <h3 className="mt-4 text-lg font-bold text-neutral-900">No matching prints found</h3>
                                <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                                    Try adjusting your search query, clearing filters, or browsing other categories.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-5 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {products.data.map((prod) => (
                                    <ProductCard key={prod.id} product={prod} />
                                ))}
                            </div>
                        )}

                        {/* Pagination Links */}
                        {products.last_page > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-1">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                            link.active
                                                ? 'bg-neutral-900 text-white'
                                                : link.url
                                                ? 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                                : 'text-neutral-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="w-screen max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between">
                            <div className="space-y-6 overflow-y-auto">
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                                    <h3 className="font-extrabold text-neutral-900 text-base">Filter Products</h3>
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-2">Category</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs font-medium"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.slug}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-2">Price Range</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min ₹"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="rounded-xl border border-neutral-300 p-2.5 text-xs"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max ₹"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="rounded-xl border border-neutral-300 p-2.5 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        handleReset();
                                        setMobileFiltersOpen(false);
                                    }}
                                    className="rounded-full border border-neutral-300 py-3 text-xs font-bold text-neutral-700"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => {
                                        applyFilters();
                                        setMobileFiltersOpen(false);
                                    }}
                                    className="rounded-full bg-neutral-900 py-3 text-xs font-bold text-white"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
}
