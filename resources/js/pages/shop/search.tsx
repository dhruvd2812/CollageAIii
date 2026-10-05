import { Link, router } from '@inertiajs/react';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store-layout';

interface SearchPageProps {
    query: string;
    products: {
        data: any[];
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: any[];
}

export default function SearchPage({ query = '', products, categories = [] }: SearchPageProps) {
    const [searchTerm, setSearchTerm] = useState(query);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.get('/search', { q: searchTerm.trim() });
        }
    };

    return (
        <StoreLayout
            title={`Search results for "${query}"`}
            description={`Search custom printing products on PRINTWITHDWARKESH.`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Search Bar Header */}
                <div className="max-w-2xl mx-auto text-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                        Search Our Print Catalog
                    </h1>
                    <form onSubmit={handleSearch} className="mt-4 flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, category, or product..."
                                className="w-full rounded-full bg-white border border-neutral-300 px-5 py-3 text-xs sm:text-sm text-neutral-900 focus:border-rose-500 focus:outline-none shadow-xs"
                            />
                            <Search className="absolute right-4 top-3.5 size-4 text-neutral-400" />
                        </div>
                        <button
                            type="submit"
                            className="rounded-full bg-neutral-900 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Results count */}
                <div className="pb-6 border-b border-neutral-200 flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-neutral-600">
                        {query ? (
                            <>
                                Found <span className="font-bold text-neutral-900">{products.total}</span> results for "
                                <span className="font-semibold text-rose-600">{query}</span>"
                            </>
                        ) : (
                            <span>Showing all products</span>
                        )}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="pt-8">
                    {products.data.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8 max-w-md mx-auto">
                            <Search className="size-12 mx-auto text-neutral-300" />
                            <h3 className="mt-4 text-base font-bold text-neutral-900">No results found</h3>
                            <p className="text-xs text-neutral-500 mt-1">
                                We couldn't find any products matching your search terms.
                            </p>
                            <Link
                                href="/shop"
                                className="mt-5 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {products.data.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
