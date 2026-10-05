import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    ChevronDown,
    Heart,
    Instagram,
    Layers,
    Menu,
    Minus,
    PackageCheck,
    Phone,
    Plus,
    Search,
    Share2,
    ShoppingBag,
    Sparkles,
    Star,
    Trash2,
    User,
    X,
} from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';

interface StoreLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function StoreLayout({ children, title, description }: StoreLayoutProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};
    const flash = pageProps?.flash || {};

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [cartData, setCartData] = useState<any>(null);
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Load initial cart summary
    const refreshCart = async () => {
        try {
            const res = await fetch('/cart/summary', {
                headers: { Accept: 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                setCartData(data);
            }
        } catch (e) {
            // Silently handle
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    // Listen to flash messages
    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success);
            refreshCart();
        }
        if (flash?.error) {
            showToast(`⚠️ ${flash.error}`);
        }
    }, [flash]);

    // Handle Search Submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchOpen(false);
            router.get('/search', { q: searchQuery.trim() });
        }
    };

    // Cart Quantity modifier
    const handleUpdateQuantity = async (itemId: number, newQty: number) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/cart/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({ quantity: newQty }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.cart) setCartData(data.cart);
            }
        } catch (e) {
            showToast('Failed to update quantity.');
        }
    };

    // Cart Remove item
    const handleRemoveItem = async (itemId: number) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.cart) setCartData(data.cart);
                showToast('Item removed from your bag.');
            }
        } catch (e) {
            showToast('Failed to remove item.');
        }
    };

    // Apply Coupon
    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponInput.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/cart/coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({ code: couponInput.trim() }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                if (data.cart) setCartData(data.cart);
                showToast(data.message || 'Coupon applied successfully!');
                setCouponInput('');
            } else {
                setCouponError(data.message || 'Invalid coupon code.');
            }
        } catch (e) {
            setCouponError('Could not validate coupon.');
        } finally {
            setCouponLoading(false);
        }
    };

    // Remove Coupon
    const handleRemoveCoupon = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/cart/coupon', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
            });
            const data = await res.json();
            if (data.cart) setCartData(data.cart);
            showToast('Coupon removed.');
        } catch (e) {
            showToast('Could not remove coupon.');
        }
    };

    const cartCount = cartData?.items_count ?? 0;
    const cartSubtotal = cartData?.subtotal ?? 0;
    const cartDiscount = cartData?.discount ?? 0;
    const cartShipping = cartData?.shipping ?? 0;
    const cartGrandTotal = cartData?.grand_total ?? 0;
    const itemsList = cartData?.items ?? [];

    return (
        <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans antialiased selection:bg-rose-500 selection:text-white flex flex-col">
            <Head>
                <title>{title ? `${title} | PRINTWITHDWARKESH` : 'PRINTWITHDWARKESH | Custom Printing, Posters, Mugs & Photo Gifts'}</title>
                {description && <meta name="description" content={description} />}
            </Head>

            {/* TOP ANNOUNCEMENT TICKER */}
            <div className="bg-neutral-950 text-neutral-100 px-4 py-2 text-xs font-medium tracking-wide">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="inline-flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-neutral-300">Fast 48h Dispatch across India</span>
                    </div>
                    <div className="mx-auto text-center sm:mx-0">
                        <span className="text-rose-400 font-bold">SPECIAL LAUNCH:</span> Use code{' '}
                        <button
                            onClick={() => {
                                setCouponInput('PRINT10');
                                showToast('Coupon code PRINT10 copied! Apply in bag.');
                            }}
                            className="font-bold underline decoration-rose-400 hover:text-white cursor-pointer"
                        >
                            PRINT10
                        </button>{' '}
                        for 10% OFF • Free shipping on orders over ₹799!
                    </div>
                    <div className="hidden lg:flex items-center gap-4 text-neutral-400 text-[11px]">
                        <Link href="/custom-design" className="hover:text-white transition">
                            Custom Studio
                        </Link>
                        <span>•</span>
                        <Link href="/contact" className="hover:text-white transition">
                            Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* STICKY HEADER */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-all">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-neutral-950 shadow-md group-hover:bg-rose-600 transition-colors duration-300">
                            <AppLogoIcon className="size-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold tracking-tight text-neutral-900 text-lg sm:text-xl leading-none">
                                PRINTWITHDWARKESH
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 mt-0.5">
                                Custom Print & Gifts
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-neutral-700">
                        <Link href="/" className="hover:text-rose-600 transition">
                            Home
                        </Link>
                        <Link href="/shop" className="hover:text-rose-600 transition">
                            Shop
                        </Link>
                        <Link href="/shop" className="hover:text-rose-600 transition">
                            Categories
                        </Link>
                        <Link
                            href="/custom-design"
                            className="flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                        >
                            <Sparkles className="size-3.5" />
                            Custom Design
                        </Link>
                        <Link href="/about" className="hover:text-rose-600 transition">
                            About
                        </Link>
                        <Link href="/contact" className="hover:text-rose-600 transition">
                            Contact
                        </Link>
                    </nav>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="flex items-center justify-center size-10 rounded-full text-neutral-700 hover:bg-neutral-100 transition"
                        >
                            <Search className="size-5" />
                        </button>

                        {/* Wishlist Link */}
                        <Link
                            href="/account/wishlist"
                            aria-label="Wishlist"
                            className="relative flex items-center justify-center size-10 rounded-full text-neutral-700 hover:bg-neutral-100 transition"
                        >
                            <Heart className="size-5" />
                        </Link>

                        {/* Shopping Bag Button */}
                        <button
                            onClick={() => {
                                refreshCart();
                                setCartDrawerOpen(true);
                            }}
                            aria-label="Shopping Bag"
                            className="relative flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-white hover:bg-rose-600 transition shadow-sm active:scale-95"
                        >
                            <ShoppingBag className="size-4" />
                            <span className="hidden sm:inline text-xs font-semibold">Bag</span>
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">
                                {cartCount}
                            </span>
                        </button>

                        {/* Account Link / Login */}
                        {auth.user ? (
                            <div className="relative group">
                                <Link
                                    href="/account"
                                    className="hidden sm:flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                                >
                                    <User className="size-3.5" />
                                    <span className="max-w-24 truncate">{auth.user.name.split(' ')[0]}</span>
                                    <ChevronDown className="size-3" />
                                </Link>
                                <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200 group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                                    <Link
                                        href="/account"
                                        className="block rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                                    >
                                        My Dashboard
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        className="block rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                                    >
                                        Orders & Tracking
                                    </Link>
                                    <Link
                                        href="/account/addresses"
                                        className="block rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                                    >
                                        Saved Addresses
                                    </Link>
                                    <Link
                                        href="/account/wishlist"
                                        className="block rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                                    >
                                        Saved Wishlist
                                    </Link>
                                    {auth.user.isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="block rounded-xl px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 mt-1"
                                        >
                                            Admin Portal
                                        </Link>
                                    )}
                                    <div className="my-1 border-t border-neutral-100" />
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                            >
                                <User className="size-3.5" />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Open navigation menu"
                            className="flex lg:hidden items-center justify-center size-10 rounded-xl text-neutral-700 hover:bg-neutral-100 transition"
                        >
                            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-neutral-200 bg-white px-5 py-6 shadow-xl animate-in slide-in-from-top duration-200">
                        <nav className="flex flex-col gap-4 text-base font-medium">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-neutral-900 font-bold">
                                Home
                            </Link>
                            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-neutral-700 hover:text-rose-600">
                                Shop All Products
                            </Link>
                            <Link
                                href="/custom-design"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-rose-600 font-semibold"
                            >
                                <Sparkles className="size-4" />
                                Custom Design Studio
                            </Link>
                            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-neutral-700 hover:text-rose-600">
                                About Us
                            </Link>
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-neutral-700 hover:text-rose-600">
                                Contact & Support
                            </Link>

                            <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href="/account"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full text-center rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white"
                                        >
                                            Customer Account
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full text-center rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700"
                                        >
                                            Log Out
                                        </Link>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-center rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-800"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-center rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT WRAPPER */}
            <main className="flex-1">{children}</main>

            {/* FOOTER */}
            <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800 mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
                        {/* Brand Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
                                    <AppLogoIcon className="size-6" />
                                </div>
                                <span className="font-extrabold tracking-tight text-white text-xl">
                                    PRINTWITHDWARKESH
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                                India's trusted custom printing studio. We turn your digital photos, graphic artwork, and
                                corporate branding into museum-grade physical products.
                            </p>
                            <div className="flex items-center gap-3 text-neutral-400 pt-2">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex size-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-rose-600 hover:text-white transition"
                                >
                                    <Instagram className="size-4" />
                                </a>
                                <a
                                    href="https://pinterest.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Pinterest"
                                    className="flex size-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-rose-600 hover:text-white transition"
                                >
                                    <Share2 className="size-4" />
                                </a>
                                <a
                                    href="tel:+919876543210"
                                    aria-label="Phone Support"
                                    className="flex size-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-rose-600 hover:text-white transition"
                                >
                                    <Phone className="size-4" />
                                </a>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                                Quick Links
                            </h4>
                            <ul className="space-y-2.5 text-xs">
                                <li>
                                    <Link href="/" className="hover:text-white transition">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop" className="hover:text-white transition">
                                        Shop All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/custom-design" className="hover:text-white transition">
                                        Custom Studio
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-white transition">
                                        About Our Craft
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-white transition">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Policies */}
                        <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                                Store Policies
                            </h4>
                            <ul className="space-y-2.5 text-xs">
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-white transition">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-white transition">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping-policy" className="hover:text-white transition">
                                        Shipping Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/refund-policy" className="hover:text-white transition">
                                        Refund & Replacement
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                                Contact & Studio
                            </h4>
                            <div className="space-y-3 text-xs text-neutral-400">
                                <p>
                                    <span className="font-bold text-white block">Email:</span>
                                    <span>hello@printwithdwarkesh.com</span>
                                </p>
                                <p>
                                    <span className="font-bold text-white block">WhatsApp Support:</span>
                                    <span>+91 98765 43210</span>
                                </p>
                                <p>
                                    <span className="font-bold text-white block">Studio Location:</span>
                                    <span>Printing Hub, Gujarat, India</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                        <p>© {new Date().getFullYear()} PRINTWITHDWARKESH. All rights reserved.</p>
                        <div className="flex items-center gap-3 text-[11px]">
                            <span>100% Genuine Quality</span>
                            <span>•</span>
                            <span>Cash on Delivery / UPI</span>
                            <span>•</span>
                            <span>Secure Orders</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* INTERACTIVE SLIDE-OVER CART DRAWER */}
            {cartDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setCartDrawerOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="size-5 text-rose-600" />
                                    <h3 className="font-extrabold text-neutral-900 text-lg">Your Bag ({cartCount})</h3>
                                </div>
                                <button
                                    onClick={() => setCartDrawerOpen(false)}
                                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Free Shipping Progress */}
                            <div className="bg-[#faf8f5] px-6 py-3 border-b border-neutral-200/80">
                                {cartSubtotal >= 799 ? (
                                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                        <PackageCheck className="size-4" /> 🎉 You unlocked FREE Express Delivery!
                                    </p>
                                ) : (
                                    <div>
                                        <p className="text-xs text-neutral-600">
                                            Add <span className="font-bold text-neutral-900">₹{799 - cartSubtotal}</span> more for{' '}
                                            <span className="font-bold text-rose-600">FREE Delivery</span>!
                                        </p>
                                        <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                                            <div
                                                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(100, (cartSubtotal / 799) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cart Items List */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                {itemsList.length === 0 ? (
                                    <div className="text-center py-16">
                                        <ShoppingBag className="size-12 mx-auto text-neutral-300" />
                                        <h4 className="mt-3 font-bold text-neutral-800">Your bag is empty</h4>
                                        <p className="text-xs text-neutral-500 mt-1">Explore our prints and customize your favorite.</p>
                                        <Link
                                            href="/shop"
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="mt-4 inline-block rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    itemsList.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="size-20 rounded-xl object-cover bg-white"
                                            />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                                                            {item.name}
                                                        </h4>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="text-neutral-400 hover:text-rose-500 transition"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                    {item.customization && (
                                                        <div className="mt-1 space-y-0.5 text-[10px] text-neutral-500">
                                                            {Object.entries(item.customization).map(([k, v]: [string, any]) => (
                                                                <p key={k} className="truncate">
                                                                    <span className="font-semibold">{v.option_name}:</span> {v.label || v.value}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {item.upload && (
                                                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                            <Check className="size-3" /> Design Uploaded
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="font-extrabold text-xs sm:text-sm text-neutral-900">
                                                        ₹{item.line_total}
                                                    </span>
                                                    <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-2 py-0.5">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                            className="text-neutral-600 hover:text-neutral-900"
                                                        >
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="text-neutral-600 hover:text-neutral-900"
                                                        >
                                                            <Plus className="size-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Drawer Footer */}
                            {itemsList.length > 0 && (
                                <div className="border-t border-neutral-200 p-6 bg-neutral-50 space-y-4">
                                    {/* Coupon box */}
                                    {cartData?.coupon?.code && !cartData?.coupon?.error ? (
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                                <Check className="size-3.5" />
                                                <span>Code {cartData.coupon.code} active (-₹{cartDiscount})</span>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-neutral-500 hover:text-rose-600 text-[11px] font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                placeholder="Coupon code (PRINT10)"
                                                className="flex-1 rounded-xl bg-white border border-neutral-300 px-3 py-2 text-xs uppercase text-neutral-900 focus:outline-none focus:border-rose-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={couponLoading}
                                                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50"
                                            >
                                                {couponLoading ? '...' : 'Apply'}
                                            </button>
                                        </form>
                                    )}
                                    {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}

                                    {/* Financial Breakdown */}
                                    <div className="space-y-1.5 text-xs text-neutral-600">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-neutral-900">₹{cartSubtotal}</span>
                                        </div>
                                        {cartDiscount > 0 && (
                                            <div className="flex justify-between text-emerald-600 font-semibold">
                                                <span>Discount</span>
                                                <span>-₹{cartDiscount}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="font-semibold text-neutral-900">
                                                {cartShipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${cartShipping}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                                            <span>Total Amount</span>
                                            <span>₹{cartGrandTotal}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href="/cart"
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="rounded-full border border-neutral-300 py-3 text-center text-xs font-bold text-neutral-800 hover:bg-white transition"
                                        >
                                            View Full Cart
                                        </Link>
                                        <Link
                                            href="/checkout"
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="rounded-full bg-neutral-900 py-3 text-center text-xs font-bold text-white hover:bg-rose-600 transition shadow-md"
                                        >
                                            Checkout →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH MODAL */}
            {searchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setSearchOpen(false)}
                    />
                    <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                            <Search className="size-5 text-neutral-400" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search posters, mugs, bottles, t-shirts, visiting cards..."
                                className="w-full text-base font-medium text-neutral-900 focus:outline-none placeholder-neutral-400"
                            />
                            <button
                                type="button"
                                onClick={() => setSearchOpen(false)}
                                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100"
                            >
                                <X className="size-5" />
                            </button>
                        </form>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="font-bold text-neutral-500 py-1">Trending Searches:</span>
                            {['Wall Posters', 'Ceramic Mugs', 'Visiting Cards', 'T-Shirts', 'Photo Prints', 'Spotify Lamp'].map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery(tag);
                                        setSearchOpen(false);
                                        router.get('/search', { q: tag });
                                    }}
                                    className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-neutral-900 px-5 py-3 text-xs font-bold text-white shadow-2xl border border-neutral-700 animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
                    <Sparkles className="size-4 text-rose-400" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
