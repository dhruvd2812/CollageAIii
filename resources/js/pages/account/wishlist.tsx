import { Link, router, usePage } from '@inertiajs/react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import CustomerAccountLayout from '@/layouts/customer-account-layout';

interface ProductImage {
    id: number;
    url: string;
    alt_text: string | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    sale_price: number | null;
    effective_price: number;
    has_discount: boolean;
    discount_percent: number | null;
    primary_image_url: string | null;
    images: ProductImage[];
    category: { name: string; slug: string } | null;
}

interface Props {
    wishlistProducts: Product[];
}

export default function WishlistPage({ wishlistProducts }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    function handleRemove(productId: number) {
        router.delete(`/wishlist/${productId}`, { preserveScroll: true });
    }

    function handleMoveToCart(productId: number) {
        router.post(`/wishlist/${productId}/move-to-cart`, {}, { preserveScroll: true });
    }

    return (
        <CustomerAccountLayout title="My Wishlist" description="Products you've saved for later.">
            <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-extrabold text-neutral-900">Saved Items</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {wishlistProducts.length > 0 && (
                        <Link
                            href="/shop"
                            className="text-xs font-bold text-rose-600 hover:text-rose-700"
                        >
                            Continue Shopping
                        </Link>
                    )}
                </div>

                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="size-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-neutral-500">Your wishlist is empty</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Browse our products and tap the heart icon to save items you love.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block mt-5 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                        >
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistProducts.map((product) => {
                            const imgUrl = product.primary_image_url || (product.images?.[0]?.url ?? null);

                            return (
                                <div
                                    key={product.id}
                                    className="group rounded-2xl border border-neutral-100 overflow-hidden hover:border-neutral-200 hover:shadow-md transition"
                                >
                                    {/* Image */}
                                    <Link href={`/product/${product.slug}`} className="block">
                                        <div className="relative aspect-square bg-neutral-100">
                                            {imgUrl ? (
                                                <img
                                                    src={imgUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full">
                                                    <ShoppingBag className="size-10 text-neutral-300" />
                                                </div>
                                            )}
                                            {product.has_discount && product.discount_percent && (
                                                <span className="absolute top-3 left-3 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                                    −{Math.round(product.discount_percent)}%
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Details */}
                                    <div className="p-4">
                                        {product.category && (
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                                                {product.category.name}
                                            </p>
                                        )}
                                        <Link href={`/product/${product.slug}`}>
                                            <h4 className="text-sm font-bold text-neutral-900 hover:text-rose-600 transition line-clamp-2">
                                                {product.name}
                                            </h4>
                                        </Link>

                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="text-base font-extrabold text-neutral-900">
                                                ₹{product.effective_price.toLocaleString('en-IN')}
                                            </span>
                                            {product.has_discount && (
                                                <span className="text-xs text-neutral-400 line-through">
                                                    ₹{product.base_price.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <button
                                                onClick={() => handleMoveToCart(product.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition"
                                            >
                                                <ShoppingBag className="size-3.5" />
                                                Move to Bag
                                            </button>
                                            <button
                                                onClick={() => handleRemove(product.id)}
                                                className="flex items-center justify-center size-9 rounded-full bg-neutral-100 text-neutral-500 hover:bg-red-50 hover:text-red-600 transition"
                                                title="Remove"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
