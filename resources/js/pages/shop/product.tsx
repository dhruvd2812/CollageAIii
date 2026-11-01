import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Heart,
    Image as ImageIcon,
    Info,
    Minus,
    PackageCheck,
    Plus,
    Printer,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Truck,
    UploadCloud,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store-layout';

interface ProductPageProps {
    product: {
        id: number;
        name: string;
        slug: string;
        sku: string;
        base_price: number;
        sale_price?: number | null;
        effective_price: number;
        has_discount: boolean;
        discount_percent: number;
        short_description?: string;
        description?: string;
        stock_quantity: number;
        manage_stock?: boolean;
        low_stock_threshold?: number;
        is_customizable: boolean;
        category?: {
            id: number;
            name: string;
            slug: string;
        };
        images: Array<{
            id: number;
            url: string;
            alt_text?: string;
            is_primary: boolean;
        }>;
        options: Array<{
            id: number;
            name: string;
            code: string;
            type: string;
            is_required: boolean;
            values: Array<{
                id: number;
                label: string;
                value: string;
                price_adjustment: number;
            }>;
        }>;
        reviews: Array<{
            id: number;
            rating: number;
            review: string;
            created_at: string;
            user?: {
                name: string;
            };
        }>;
    };
    relatedProducts: any[];
    canReview: boolean;
    purchasedOrderItemId?: number | null;
}

export default function ProductDetailPage({
    product,
    relatedProducts = [],
    canReview = false,
    purchasedOrderItemId = null,
}: ProductPageProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};

    // Images gallery
    const images = product.images.length > 0
        ? product.images
        : [{ id: 1, url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85', alt_text: product.name, is_primary: true }];

    const [selectedImage, setSelectedImage] = useState(images[0]?.url || '');
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);

    // Initial selected options
    const initialOptions: Record<string, string> = {};
    product.options.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
            initialOptions[opt.code] = opt.values[0].value;
        }
    });

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
    const [customNotes, setCustomNotes] = useState('');

    // File Upload state
    const [uploadedFile, setUploadedFile] = useState<{ id: number; name: string; url: string; is_image: boolean } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // Review modal state
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    // Calculate dynamic calculated price based on option adjustments
    const currentUnitPrice = useMemo(() => {
        let price = product.effective_price;
        product.options.forEach((opt) => {
            const selectedVal = selectedOptions[opt.code];
            if (selectedVal) {
                const optVal = opt.values.find((v) => v.value === selectedVal);
                if (optVal) {
                    price += optVal.price_adjustment;
                }
            }
        });
        return price;
    }, [product, selectedOptions]);

    const lineTotal = currentUnitPrice * quantity;

    // Handle Option change
    const handleOptionSelect = (code: string, value: string) => {
        setSelectedOptions((prev) => ({ ...prev, [code]: value }));
    };

    // Handle Design Upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/uploads/design', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setUploadedFile(data.upload);
            } else {
                setUploadError(data.message || data.errors?.file?.[0] || 'Upload failed. Allowed: JPG, PNG, WEBP, PDF up to 25MB.');
            }
        } catch (err) {
            setUploadError('Network error during file upload.');
        } finally {
            setUploading(false);
        }
    };

    // Add To Cart
    const handleAddToCart = async (buyNowDirect = false) => {
        if (buyNowDirect) setBuyingNow(true);
        else setAddingToCart(true);

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
                    quantity: quantity,
                    options: selectedOptions,
                    upload_id: uploadedFile?.id ?? null,
                    notes: customNotes || null,
                }),
            });

            if (res.ok) {
                if (buyNowDirect) {
                    router.get('/checkout');
                } else {
                    router.reload({ only: ['flash'] });
                }
            }
        } catch (err) {
            // Silently handle
        } finally {
            setAddingToCart(false);
            setBuyingNow(false);
        }
    };

    // Submit Review
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!purchasedOrderItemId) return;

        setSubmittingReview(true);
        try {
            router.post(
                '/reviews',
                {
                    order_item_id: purchasedOrderItemId,
                    rating: reviewRating,
                    review: reviewText,
                },
                {
                    onSuccess: () => {
                        setReviewModalOpen(false);
                        setReviewText('');
                    },
                }
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    // Toggle Wishlist
    const handleToggleWishlist = async () => {
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

    const avgRating = product.reviews.length > 0
        ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
        : '4.9';

    return (
        <StoreLayout
            title={`${product.name}`}
            description={product.short_description || product.description}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8">
                    <Link href="/" className="hover:text-neutral-900">
                        Home
                    </Link>
                    <ChevronRight className="size-3 text-neutral-400" />
                    <Link href="/shop" className="hover:text-neutral-900">
                        Shop
                    </Link>
                    {product.category && (
                        <>
                            <ChevronRight className="size-3 text-neutral-400" />
                            <Link href={`/category/${product.category.slug}`} className="hover:text-neutral-900">
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight className="size-3 text-neutral-400" />
                    <span className="text-neutral-900 truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT: IMAGE GALLERY */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Main Big Image */}
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200/80 shadow-xs">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                            />
                            {product.has_discount && (
                                <span className="absolute top-4 left-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs">
                                    {product.discount_percent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {images.map((img) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setSelectedImage(img.url)}
                                        className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                                            selectedImage === img.url
                                                ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                                                : 'border-neutral-200 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.url} alt="Thumbnail" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust Guarantee Box */}
                        <div className="rounded-3xl bg-white p-5 border border-neutral-200/80 shadow-xs space-y-3">
                            <div className="flex items-center gap-3 text-xs text-neutral-700">
                                <Printer className="size-4 text-rose-600 shrink-0" />
                                <span>Ultra-HD 2400 DPI Japanese archival pigment printing</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700">
                                <Truck className="size-4 text-emerald-600 shrink-0" />
                                <span>Express 48-Hour Dispatch across all Indian pincodes</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-700">
                                <ShieldCheck className="size-4 text-indigo-600 shrink-0" />
                                <span>100% Delight Guarantee (Free reprint if damaged in transit)</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT DETAILS & CUSTOMIZER */}
                    <div className="lg:col-span-6 space-y-6">
                        <div>
                            {product.category && (
                                <Link
                                    href={`/category/${product.category.slug}`}
                                    className="inline-block text-xs font-bold uppercase tracking-wider text-rose-600 hover:underline mb-1"
                                >
                                    {product.category.name}
                                </Link>
                            )}
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 leading-tight">
                                {product.name}
                            </h1>

                            <div className="mt-2.5 flex items-center gap-3 text-xs text-neutral-600">
                                <div className="flex items-center gap-1 font-bold text-neutral-900">
                                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                    <span>{avgRating}</span>
                                </div>
                                <span>•</span>
                                <span>{product.reviews.length} Verified Reviews</span>
                                <span>•</span>
                                <span className="font-semibold text-emerald-600">SKU: {product.sku}</span>
                                {product.manage_stock && (
                                    <>
                                        <span>•</span>
                                        {product.stock_quantity <= 0 ? (
                                            <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[11px]">
                                                Out of Stock
                                            </span>
                                        ) : product.stock_quantity <= (product.low_stock_threshold || 5) ? (
                                            <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                                                Only {product.stock_quantity} left in stock!
                                            </span>
                                        ) : (
                                            <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                                                In Stock ({product.stock_quantity} available)
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Price Tag */}
                        <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-200/80 flex items-baseline justify-between">
                            <div>
                                <span className="text-xs text-neutral-500 block">Unit Price</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-neutral-950">
                                        ₹{currentUnitPrice}
                                    </span>
                                    {product.has_discount && (
                                        <span className="text-sm text-neutral-400 line-through">
                                            ₹{product.base_price}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-neutral-500 block">Subtotal</span>
                                <span className="text-lg font-bold text-neutral-900">₹{lineTotal}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            {product.description || product.short_description}
                        </p>

                        {/* PRODUCT OPTIONS ARCHITECTURE */}
                        {product.options.map((option) => (
                            <div key={option.id} className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                                    {option.name}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((val) => {
                                        const isSelected = selectedOptions[option.code] === val.value;
                                        return (
                                            <button
                                                key={val.id}
                                                type="button"
                                                onClick={() => handleOptionSelect(option.code, val.value)}
                                                className={`rounded-2xl px-4 py-2 text-xs font-bold border transition ${
                                                    isSelected
                                                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                                                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                                                }`}
                                            >
                                                <span>{val.label}</span>
                                                {val.price_adjustment !== 0 && (
                                                    <span className={`ml-1 text-[11px] ${isSelected ? 'text-rose-300' : 'text-rose-600'}`}>
                                                        (+₹{val.price_adjustment})
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* DESIGN & PHOTO UPLOAD SECTION */}
                        {product.is_customizable && (
                            <div className="rounded-3xl bg-white p-5 border-2 border-dashed border-neutral-300 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                                        <UploadCloud className="size-4 text-rose-600" />
                                        <span>Upload Your Design / Photo</span>
                                    </label>
                                    <span className="text-[10px] font-bold text-neutral-500">JPG, PNG, WEBP, PDF (Max 25MB)</span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,.pdf,.svg"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="w-full text-xs text-neutral-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-rose-600 cursor-pointer"
                                    />
                                </div>

                                {uploading && (
                                    <p className="text-xs font-semibold text-neutral-500 animate-pulse">
                                        Uploading and securing your design file...
                                    </p>
                                )}

                                {uploadError && (
                                    <p className="text-xs font-bold text-rose-600">{uploadError}</p>
                                )}

                                {uploadedFile && (
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                                        {uploadedFile.is_image ? (
                                            <img
                                                src={uploadedFile.url}
                                                alt="Upload preview"
                                                className="size-12 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="size-12 rounded-xl bg-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-xs">
                                                PDF
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 text-xs">
                                            <p className="font-bold text-emerald-900 truncate">{uploadedFile.name}</p>
                                            <span className="text-[11px] text-emerald-700">✓ Uploaded & Ready for Production</span>
                                        </div>
                                        <button
                                            onClick={() => setUploadedFile(null)}
                                            className="text-neutral-400 hover:text-rose-600"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                )}

                                <p className="text-[11px] text-neutral-500 italic">
                                    Note: Your design is securely reviewed and prepared for production upon order placement.
                                </p>
                            </div>
                        )}

                        {/* Optional Custom Notes / Instructions */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                                Custom Text / Special Notes (Optional)
                            </label>
                            <input
                                type="text"
                                value={customNotes}
                                onChange={(e) => setCustomNotes(e.target.value)}
                                placeholder="e.g. Add name 'Rahul' on front, or landscape orientation"
                                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                            />
                        </div>

                        {/* Quantity and Actions */}
                        <div className="pt-2 space-y-3">
                            {product.manage_stock && product.stock_quantity <= 0 ? (
                                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
                                    <p className="text-sm font-extrabold text-red-600">Currently Out of Stock</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        This item is temporarily unavailable for purchase. Please check back soon!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        {/* Quantity controls */}
                                        <div className="flex items-center rounded-full border border-neutral-300 bg-white px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                className="text-neutral-600 hover:text-neutral-900 px-1 disabled:opacity-30"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="size-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-extrabold">{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        product.manage_stock
                                                            ? Math.min(product.stock_quantity, q + 1)
                                                            : q + 1
                                                    )
                                                }
                                                className="text-neutral-600 hover:text-neutral-900 px-1 disabled:opacity-30"
                                                disabled={
                                                    product.manage_stock && quantity >= product.stock_quantity
                                                }
                                            >
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>

                                        {/* Add to Bag Button */}
                                        <button
                                            onClick={() => handleAddToCart(false)}
                                            disabled={addingToCart}
                                            className="flex-1 rounded-full bg-neutral-950 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <ShoppingBag className="size-4" />
                                            <span>{addingToCart ? 'Adding to Bag...' : `Add to Bag (₹${lineTotal})`}</span>
                                        </button>

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={handleToggleWishlist}
                                            aria-label="Wishlist"
                                            className="flex size-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-rose-600 transition"
                                        >
                                            <Heart className={`size-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                        </button>
                                    </div>

                                    {/* Buy Now Direct Button */}
                                    <button
                                        onClick={() => handleAddToCart(true)}
                                        disabled={buyingNow}
                                        className="w-full rounded-full bg-gradient-to-r from-rose-600 to-amber-600 py-3.5 text-xs sm:text-sm font-extrabold text-white hover:brightness-110 shadow-lg shadow-rose-600/20 transition active:scale-95 disabled:opacity-50"
                                    >
                                        {buyingNow ? 'Redirecting to Checkout...' : 'Buy Now with 1-Click'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* VERIFIED BUYER REVIEWS SECTION */}
                <div className="mt-20 pt-12 border-t border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-200 gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-neutral-950">
                                Verified Customer Reviews ({product.reviews.length})
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1">
                                Genuine reviews from verified buyers who ordered this product.
                            </p>
                        </div>

                        {canReview && (
                            <button
                                onClick={() => setReviewModalOpen(true)}
                                className="rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 transition shadow-xs"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    <div className="pt-8">
                        {product.reviews.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 p-6">
                                <Star className="size-10 mx-auto text-neutral-300" />
                                <h3 className="mt-3 font-bold text-neutral-900 text-sm">No reviews submitted yet</h3>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Be the first verified customer to leave a review after your order arrives!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {product.reviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-xs"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-1 text-amber-500">
                                                {[...Array(rev.rating)].map((_, idx) => (
                                                    <Star key={idx} className="size-3.5 fill-current" />
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-neutral-400">
                                                {new Date(rev.created_at).toLocaleDateString('en-IN', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                                            "{rev.review}"
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-neutral-900">
                                                {rev.user?.name || 'Verified Buyer'}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                <Check className="size-3" /> Verified Purchase
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-neutral-200">
                        <div className="mb-8">
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                                Handcrafted Alternatives
                            </span>
                            <h2 className="text-2xl font-extrabold text-neutral-950 mt-1">
                                You May Also Like
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((rel) => (
                                <ProductCard key={rel.id} product={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* WRITE REVIEW MODAL */}
            {reviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        onClick={() => setReviewModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                            <h3 className="text-lg font-extrabold text-neutral-900">Write Verified Review</h3>
                            <button
                                onClick={() => setReviewModalOpen(false)}
                                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setReviewRating(s)}
                                            className="p-1 text-amber-400 hover:scale-110 transition"
                                        >
                                            <Star
                                                className={`size-6 ${
                                                    s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                                    Your Feedback / Review
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell others about the print quality, paper finish, and packing..."
                                    className="w-full rounded-2xl border border-neutral-300 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="w-full rounded-full bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50"
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
}
