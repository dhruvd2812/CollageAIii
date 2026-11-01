import { Link, router, usePage } from '@inertiajs/react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';

export interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        base_price: number;
        sale_price?: number | null;
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
    };
    onAddedToCart?: () => void;
}

export default function ProductCard({ product, onAddedToCart }: ProductCardProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};

    const [isLiked, setIsLiked] = useState(false);
    const [adding, setAdding] = useState(false);

    // Calculate rating
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '4.9';
    const reviewsCount = reviews.length;

    // Toggle Wishlist
    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            router.get('/login');
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/wishlist/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({ product_id: product.id }),
            });
            const data = await res.json();
            if (data.success) {
                setIsLiked(data.is_liked);
            }
        } catch (err) {
            // Silently handle
        }
    };

    // Quick Add to Cart
    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setAdding(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/cart/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1,
                }),
            });

            if (res.ok) {
                if (onAddedToCart) {
                    onAddedToCart();
                } else {
                    router.reload({ only: ['flash'] });
                }
            }
        } catch (err) {
            // Silently handle
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-neutral-200/80 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300">
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                    src={product.primary_image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85'}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Discount Tag */}
                {product.has_discount && (
                    <span className="absolute top-3 left-3 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                        {product.discount_percent}% OFF
                    </span>
                )}

                {/* Out of Stock Tag */}
                {product.manage_stock && typeof product.stock_quantity === 'number' && product.stock_quantity <= 0 && (
                    <span className="absolute top-3 left-3 rounded-full bg-neutral-900/90 text-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                        Out of Stock
                    </span>
                )}

                {/* Wishlist Heart */}
                <button
                    onClick={handleToggleWishlist}
                    aria-label="Save to Wishlist"
                    className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-sm backdrop-blur-xs hover:bg-white hover:text-rose-600 transition"
                >
                    <Heart className={`size-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Quick View */}
                <div className="absolute inset-x-3 bottom-3 hidden group-hover:flex items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2 text-xs font-bold text-neutral-900 shadow-md backdrop-blur-xs transition hover:bg-white">
                    <Eye className="size-3.5" />
                    <span>View Details</span>
                </div>
            </Link>

            {/* Details */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="truncate">{product.category?.name || 'Custom Print'}</span>
                    <span className="flex items-center gap-1 font-semibold text-neutral-800 shrink-0">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {avgRating} {reviewsCount > 0 && `(${reviewsCount})`}
                    </span>
                </div>

                <Link
                    href={`/product/${product.slug}`}
                    className="mt-1.5 font-bold text-neutral-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors"
                >
                    {product.name}
                </Link>

                <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed flex-1">
                    {product.short_description || 'High-definition customized print with premium materials.'}
                </p>

                {/* Pricing & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                        {product.has_discount && (
                            <span className="text-xs text-neutral-400 line-through mr-1.5">
                                ₹{product.base_price}
                            </span>
                        )}
                        <span className="text-base sm:text-lg font-extrabold text-neutral-900">
                            ₹{product.effective_price}
                        </span>
                    </div>

                    {product.manage_stock && typeof product.stock_quantity === 'number' && product.stock_quantity <= 0 ? (
                        <span className="text-[11px] font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
                            Sold Out
                        </span>
                    ) : (
                        <button
                            onClick={handleQuickAdd}
                            disabled={adding}
                            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition active:scale-95 shadow-sm disabled:opacity-50"
                        >
                            <ShoppingBag className="size-3.5" />
                            <span>{adding ? '...' : 'Add'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
