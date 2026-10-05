import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CreditCard,
    Lock,
    MapPin,
    PackageCheck,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Truck,
} from 'lucide-react';
import React, { useState } from 'react';
import StoreLayout from '@/layouts/store-layout';

interface CheckoutPageProps {
    cart: {
        items: any[];
        items_count: number;
        total_quantity: number;
        subtotal: number;
        discount: number;
        shipping: number;
        grand_total: number;
        coupon?: any;
    };
    savedAddresses: Array<{
        id: number;
        recipient_name: string;
        phone: string;
        line_one: string;
        line_two?: string;
        landmark?: string;
        city: string;
        state: string;
        postal_code: string;
        country_code: string;
        is_default: boolean;
        formatted_address: string;
    }>;
    defaultAddress?: any;
    appliedCoupon?: string | null;
}

export default function CheckoutPage({
    cart,
    savedAddresses = [],
    defaultAddress,
    appliedCoupon,
}: CheckoutPageProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};

    const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<number | 'new'>(
        defaultAddress?.id ?? (savedAddresses[0]?.id ?? 'new')
    );

    const [customerName, setCustomerName] = useState(auth.user?.name || '');
    const [customerEmail, setCustomerEmail] = useState(auth.user?.email || '');
    const [customerPhone, setCustomerPhone] = useState(auth.user?.phone || '');

    const [recipientName, setRecipientName] = useState(defaultAddress?.recipient_name || auth.user?.name || '');
    const [phone, setPhone] = useState(defaultAddress?.phone || auth.user?.phone || '');
    const [lineOne, setLineOne] = useState(defaultAddress?.line_one || '');
    const [lineTwo, setLineTwo] = useState(defaultAddress?.line_two || '');
    const [landmark, setLandmark] = useState(defaultAddress?.landmark || '');
    const [city, setCity] = useState(defaultAddress?.city || '');
    const [state, setState] = useState(defaultAddress?.state || '');
    const [postalCode, setPostalCode] = useState(defaultAddress?.postal_code || '');
    const [saveAddress, setSaveAddress] = useState(true);
    const [customerNotes, setCustomerNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle selecting a saved address
    const handleSelectAddress = (addrId: number | 'new') => {
        setSelectedSavedAddressId(addrId);
        if (addrId !== 'new') {
            const addr = savedAddresses.find((a) => a.id === addrId);
            if (addr) {
                setRecipientName(addr.recipient_name);
                setPhone(addr.phone);
                setLineOne(addr.line_one);
                setLineTwo(addr.line_two || '');
                setLandmark(addr.landmark || '');
                setCity(addr.city);
                setState(addr.state);
                setPostalCode(addr.postal_code);
            }
        }
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrorMessage('');

        const payload = {
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            recipient_name: recipientName,
            phone: phone,
            line_one: lineOne,
            line_two: lineTwo,
            landmark: landmark,
            city: city,
            state: state,
            postal_code: postalCode,
            country_code: 'IN',
            payment_method: paymentMethod,
            customer_notes: customerNotes,
            save_address: saveAddress,
        };

        router.post('/checkout', payload, {
            onError: (errors) => {
                setErrorMessage(errors.checkout || Object.values(errors)[0] || 'Please complete all required fields.');
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <StoreLayout
            title="Secure Checkout"
            description="Complete your custom print order with PRINTWITHDWARKESH."
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="pb-6 border-b border-neutral-200 flex items-center justify-between">
                    <div>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 mb-2"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Return to Shopping Bag</span>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 flex items-center gap-2">
                            <Lock className="size-6 text-rose-600" />
                            <span>Secure Checkout</span>
                        </h1>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="size-4" /> 256-Bit SSL Encrypted
                    </span>
                </div>

                {errorMessage && (
                    <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
                    {/* LEFT: Customer & Address Information */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* 1. Customer Details */}
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                            <h2 className="font-extrabold text-base text-neutral-950 flex items-center gap-2">
                                <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold">
                                    1
                                </span>
                                <span>Customer Information</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                                        Your Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                                        Contact Phone / WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="e.g. +91 98765 43210"
                                        className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1">
                                    Email Address (For Order Receipts) *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    placeholder="e.g. rahul@example.com"
                                    className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* 2. Shipping Address */}
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-5">
                            <h2 className="font-extrabold text-base text-neutral-950 flex items-center gap-2">
                                <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold">
                                    2
                                </span>
                                <span>Shipping & Delivery Address</span>
                            </h2>

                            {/* Saved Addresses Selector (if logged in with addresses) */}
                            {savedAddresses.length > 0 && (
                                <div className="space-y-2.5">
                                    <label className="block text-xs font-bold text-neutral-700">Choose from Saved Addresses</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {savedAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => handleSelectAddress(addr.id)}
                                                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                                                    selectedSavedAddressId === addr.id
                                                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                                                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs text-neutral-900">{addr.recipient_name}</span>
                                                    {addr.is_default && (
                                                        <span className="text-[10px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2">
                                                    {addr.formatted_address}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 mt-0.5">📞 {addr.phone}</p>
                                            </div>
                                        ))}

                                        <div
                                            onClick={() => handleSelectAddress('new')}
                                            className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-center gap-2 ${
                                                selectedSavedAddressId === 'new'
                                                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                                                    : 'bg-neutral-50 border-dashed border-neutral-300 hover:border-neutral-400'
                                            }`}
                                        >
                                            <Plus className="size-4 text-neutral-600" />
                                            <span className="text-xs font-bold text-neutral-800">+ Add New Address</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Address Input Form */}
                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                                            Recipient Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            placeholder="Recipient name"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                                            Delivery Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="10-digit mobile number"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                                        House / Flat / Building / Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={lineOne}
                                        onChange={(e) => setLineOne(e.target.value)}
                                        placeholder="Flat 402, Royal Residency, Station Road"
                                        className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                                            Area / Locality / Sector
                                        </label>
                                        <input
                                            type="text"
                                            value={lineTwo}
                                            onChange={(e) => setLineTwo(e.target.value)}
                                            placeholder="Near City Mall"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                                            Landmark (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={landmark}
                                            onChange={(e) => setLandmark(e.target.value)}
                                            placeholder="Opposite SBI Bank"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="City"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">State *</label>
                                        <input
                                            type="text"
                                            required
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="State"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            required
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            placeholder="6-digit PIN"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {auth.user && selectedSavedAddressId === 'new' && (
                                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                                        <input
                                            type="checkbox"
                                            checked={saveAddress}
                                            onChange={(e) => setSaveAddress(e.target.checked)}
                                            className="rounded border-neutral-300 text-neutral-900 focus:ring-rose-500"
                                        />
                                        <span className="text-xs text-neutral-700">Save this address to my account</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* 3. Payment Method */}
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                            <h2 className="font-extrabold text-base text-neutral-950 flex items-center gap-2">
                                <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold">
                                    3
                                </span>
                                <span>Payment Method</span>
                            </h2>

                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-neutral-900 bg-rose-50/40 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="mt-0.5 text-neutral-900 focus:ring-rose-500"
                                    />
                                    <div>
                                        <p className="font-extrabold text-xs text-neutral-950">
                                            Cash on Delivery / Manual Order Confirmation
                                        </p>
                                        <p className="text-[11px] text-neutral-600 mt-0.5">
                                            Pay in cash upon delivery, or confirm via WhatsApp / UPI upon order review.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Order Notes */}
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-neutral-700 mb-1">
                                    Order Instructions / Notes (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={customerNotes}
                                    onChange={(e) => setCustomerNotes(e.target.value)}
                                    placeholder="Any delivery instructions, gate directions, or packaging notes..."
                                    className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-5 sticky top-24">
                            <h3 className="font-extrabold text-base text-neutral-950">
                                Order Review ({cart.items_count} items)
                            </h3>

                            {/* Item Snapshots */}
                            <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="pt-3 flex gap-3 items-center justify-between text-xs">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="size-12 rounded-xl object-cover bg-neutral-100 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                                                <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-extrabold text-neutral-900 shrink-0">
                                            ₹{item.line_total}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-200 pt-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-neutral-900">₹{cart.subtotal}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-semibold">
                                        <span>Discount</span>
                                        <span>-₹{cart.discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Courier Shipping</span>
                                    <span className="font-semibold text-neutral-900">
                                        {cart.shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${cart.shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-3 border-t border-neutral-200">
                                    <span>Total Payable</span>
                                    <span>₹{cart.grand_total}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full bg-neutral-950 py-4 text-sm font-extrabold text-white hover:bg-rose-600 transition shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Lock className="size-4" />
                                <span>{processing ? 'Processing Your Order...' : `Place Order (₹${cart.grand_total})`}</span>
                            </button>

                            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
                                By placing your order, you agree to PRINTWITHDWARKESH Terms & Conditions and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </StoreLayout>
    );
}
