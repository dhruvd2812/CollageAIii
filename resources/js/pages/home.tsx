import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Filter,
    Package,
    Plus,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Truck,
} from 'lucide-react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    image_path?: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    sale_price: number | null;
    effective_price: number;
    has_discount: boolean;
    discount_percent: number;
    primary_image_url: string;
    short_description?: string;
    manage_stock?: boolean;
    stock_quantity?: number;
    category?: {
        name: string;
        slug: string;
    };
    reviews?: Array<{ rating: number }>;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface HomeProps {
    categories: Category[];
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function Home({ categories = [], products }: HomeProps) {
    const productList = products?.data || [];

    return (
        <StoreLayout
            title="Online Shopping - PRINTWITHDWARKESH"
            description="Shop premium custom printed items, photo gifts, clothing, drinkware and accessories with fast nationwide delivery."
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                {/* 1. FLIPKART-STYLE QUICK CATEGORIES BAR */}
                {categories.length > 0 && (
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-4 sm:p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                Popular Categories
                            </span>
                            <Link
                                href="/shop"
                                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                            >
                                All Categories <ArrowRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                            <Link
                                href="/shop"
                                className="shrink-0 flex items-center gap-2 rounded-2xl bg-neutral-900 text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-neutral-800 transition"
                            >
                                <Sparkles className="size-3.5 text-amber-400" />
                                <span>All Products</span>
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className="shrink-0 flex items-center gap-2 rounded-2xl bg-neutral-100 text-neutral-800 hover:bg-rose-50 hover:text-rose-600 px-4 py-2 text-xs font-bold border border-neutral-200/60 transition"
                                >
                                    <span>{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. MINIMAL WELCOME PROMO STRIP */}
                <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-rose-950 text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                            <Sparkles className="size-3 text-rose-400" /> Direct from Studio
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Personalized Gifts &amp; Custom Prints
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-300">
                            Select any item below, choose options (size, color, print sides) or upload your photo, and order in seconds.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-neutral-300 shrink-0 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2">
                            <Truck className="size-4 text-emerald-400" />
                            <span>Fast Dispatch</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-rose-400" />
                            <span>100% Quality Print</span>
                        </div>
                    </div>
                </div>

                {/* 3. FLIPKART-STYLE PRODUCT DISCOVERY GRID */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
                                Explore Store Products
                            </h2>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Showing {productList.length} item{productList.length !== 1 ? 's' : ''} available to order
                            </p>
                        </div>
                    </div>

                    {productList.length === 0 ? (
                        /* Empty state when manager hasn't published active items yet */
                        <div className="rounded-3xl bg-white border border-neutral-200/80 p-12 text-center shadow-xs">
                            <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <Package className="size-8" />
                            </div>
                            <h3 className="text-base font-extrabold text-neutral-900">
                                Store Catalog is Updating
                            </h3>
                            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                                Products added by the manager in the Admin Portal will show up right here for customers to browse and order.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {productList.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {products?.last_page > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-10 pt-6 border-t border-neutral-200">
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
            </div>
        </StoreLayout>
    );
}
