import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store-layout';

interface CategoryProps {
    category: {
        id: number;
        name: string;
        slug: string;
        description: string;
        image_path: string;
    };
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
        min_price?: string;
        max_price?: string;
        sort?: string;
    };
}

export default function CategoryPage({ category, products, categories = [], filters = {} }: CategoryProps) {
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'featured');

    const applyFilters = (newOverrides: Record<string, any> = {}) => {
        const queryParams: Record<string, any> = {
            min_price: minPrice,
            max_price: maxPrice,
            sort: sortBy,
            ...newOverrides,
        };

        Object.keys(queryParams).forEach((k) => {
            if (!queryParams[k]) delete queryParams[k];
        });

        router.get(`/category/${category.slug}`, queryParams, { preserveState: true });
    };

    return (
        <StoreLayout
            title={`${category.name} Prints & Custom Gifts`}
            description={category.description}
        >
            {/* Category Banner Hero */}
            <div className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition mb-4"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Back to All Products</span>
                    </Link>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        {category.name}
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                        {category.description}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Filter and Sorting Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
                    <p className="text-xs sm:text-sm text-neutral-500">
                        Showing <span className="font-bold text-neutral-900">{products.total}</span> products in{' '}
                        <span className="font-semibold text-rose-600">{category.name}</span>
                    </p>

                    <div className="flex items-center gap-3">
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
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="pt-8">
                    {products.data.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8">
                            <Search className="size-12 mx-auto text-neutral-300" />
                            <h3 className="mt-4 text-lg font-bold text-neutral-900">No products found in this category</h3>
                            <Link
                                href="/shop"
                                className="mt-5 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                            >
                                Browse All Categories
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {products.data.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
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
        </StoreLayout>
    );
}
