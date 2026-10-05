import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Minus,
    PackageCheck,
    Plus,
    ShoppingBag,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import StoreLayout from '@/layouts/store-layout';

interface CartPageProps {
    cart: {
        items: any[];
        items_count: number;
        total_quantity: number;
        subtotal: number;
        discount: number;
        shipping: number;
        tax: number;
        grand_total: number;
        coupon?: {
            code: string;
            discount: number;
            type: string;
            message?: string;
            error?: string;
        } | null;
    };
    appliedCoupon?: string | null;
}

export default function CartIndexPage({ cart, appliedCoupon }: CartPageProps) {
    const [couponCode, setCouponCode] = useState(appliedCoupon || '');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const handleUpdateQuantity = (itemId: number, newQty: number) => {
        router.put(
            `/cart/items/${itemId}`,
            { quantity: newQty },
            { preserveScroll: true }
        );
    };

    const handleRemoveItem = (itemId: number) => {
        router.delete(`/cart/items/${itemId}`, { preserveScroll: true });
    };

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        router.post(
            '/cart/coupon',
            { code: couponCode.trim() },
            {
                preserveScroll: true,
                onError: (errors) => {
                    setCouponError(errors.coupon || 'Invalid coupon code.');
                    setCouponLoading(false);
                },
                onFinish: () => setCouponLoading(false),
            }
        );
    };

    const handleRemoveCoupon = () => {
        router.delete('/cart/coupon', { preserveScroll: true });
    };

    return (
        <StoreLayout
            title={`Shopping Bag (${cart.items_count})`}
            description="Review and customize your custom printing shopping bag on PRINTWITHDWARKESH."
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                            Your Shopping Bag ({cart.items_count})
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1">
                            Review your selected print configurations and proceed to checkout.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 hidden sm:inline"
                    >
                        + Continue Shopping
                    </Link>
                </div>

                {cart.items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 p-8 my-8 max-w-md mx-auto">
                        <ShoppingBag className="size-14 mx-auto text-neutral-300" />
                        <h3 className="mt-4 text-lg font-bold text-neutral-900">Your bag is empty</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                            You haven't added any custom prints or products yet.
                        </p>
                        <Link
                            href="/shop"
                            className="mt-6 inline-block rounded-full bg-neutral-900 px-8 py-3 text-xs font-bold text-white hover:bg-rose-600 transition shadow-md"
                        >
                            Explore Print Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
                        {/* LEFT: Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {/* Free Shipping Progress bar */}
                            <div className="rounded-3xl bg-white p-5 border border-neutral-200 shadow-xs">
                                {cart.subtotal >= 799 ? (
                                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                        <PackageCheck className="size-4" /> 🎉 You qualified for FREE Express Courier Delivery!
                                    </p>
                                ) : (
                                    <div>
                                        <p className="text-xs text-neutral-600">
                                            Add <span className="font-bold text-neutral-900">₹{799 - cart.subtotal}</span> more to get{' '}
                                            <span className="font-bold text-rose-600">FREE Shipping</span>!
                                        </p>
                                        <div className="mt-2.5 h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                                            <div
                                                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(100, (cart.subtotal / 799) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Items Card */}
                            <div className="rounded-3xl bg-white border border-neutral-200 divide-y divide-neutral-100 shadow-xs">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="size-24 sm:size-28 rounded-2xl object-cover bg-neutral-100 shrink-0"
                                        />

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <Link
                                                            href={`/product/${item.slug}`}
                                                            className="font-bold text-sm sm:text-base text-neutral-950 hover:text-rose-600 transition"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-xs text-neutral-400 mt-0.5">SKU: {item.sku}</p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-neutral-400 hover:text-rose-600 transition p-1"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>

                                                {/* Customization specs */}
                                                {item.customization && (
                                                    <div className="mt-2.5 space-y-1 rounded-xl bg-neutral-50 p-2.5 text-[11px] text-neutral-600 border border-neutral-200/60">
                                                        {Object.entries(item.customization).map(([k, opt]: [string, any]) => (
                                                            <div key={k} className="flex items-center gap-1.5">
                                                                <span className="font-bold text-neutral-800">{opt.option_name}:</span>
                                                                <span>{opt.label || opt.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Upload Preview */}
                                                {item.upload && (
                                                    <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                                                        <Check className="size-3.5" />
                                                        <span>Design attached: {item.upload.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quantity & Line Total */}
                                            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-neutral-500">Qty:</span>
                                                    <div className="flex items-center rounded-full border border-neutral-300 bg-white px-2.5 py-1">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            className="text-neutral-600 hover:text-neutral-900 px-1"
                                                        >
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-extrabold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="text-neutral-600 hover:text-neutral-900 px-1"
                                                        >
                                                            <Plus className="size-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-xs text-neutral-400 mr-2">₹{item.unit_price} each</span>
                                                    <span className="text-base sm:text-lg font-extrabold text-neutral-900">
                                                        ₹{item.line_total}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-xs space-y-5">
                                <h3 className="font-extrabold text-base text-neutral-950">Order Summary</h3>

                                {/* Coupon Code Input */}
                                {cart.coupon?.code && !cart.coupon?.error ? (
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                                            <Check className="size-4 text-emerald-600" />
                                            <span>Code {cart.coupon.code} (-₹{cart.discount})</span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-neutral-500 hover:text-rose-600 font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                                        <label className="block text-xs font-bold text-neutral-700">Promo Code</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="e.g. PRINT10"
                                                className="flex-1 rounded-2xl bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs uppercase font-bold text-neutral-900 focus:border-rose-500 focus:outline-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={couponLoading}
                                                className="rounded-2xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50"
                                            >
                                                {couponLoading ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
                                    </form>
                                )}

                                {/* Calculation Breakdown */}
                                <div className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cart.total_quantity} items)</span>
                                        <span className="font-semibold text-neutral-900">₹{cart.subtotal}</span>
                                    </div>

                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-semibold">
                                            <span>Coupon Discount</span>
                                            <span>-₹{cart.discount}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Estimated Shipping</span>
                                        <span className="font-semibold text-neutral-900">
                                            {cart.shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${cart.shipping}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-3 border-t border-neutral-200">
                                        <span>Estimated Total</span>
                                        <span>₹{cart.grand_total}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-4 text-sm font-extrabold text-white hover:bg-rose-600 transition shadow-lg active:scale-95"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <p className="text-[11px] text-neutral-400 text-center">
                                    Prices include GST. Safe & verified checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
