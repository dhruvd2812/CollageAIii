import { Link, router } from '@inertiajs/react';
import {
    Check,
    CreditCard,
    Layers,
    Palette,
    Plus,
    Printer,
    ShoppingBag,
    Sparkles,
    Tag,
    UploadCloud,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import StoreLayout from '@/layouts/store-layout';

interface CustomDesignProps {
    categories: any[];
    customizableProducts: any[];
}

export default function CustomDesignPage({ categories = [], customizableProducts = [] }: CustomDesignProps) {
    const [selectedProduct, setSelectedProduct] = useState(customizableProducts[0] || null);
    const [customText, setCustomText] = useState('YOUR DESIGN HERE');
    const [uploadedFile, setUploadedFile] = useState<{ id: number; name: string; url: string; is_image: boolean } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedFinish, setSelectedFinish] = useState('Archival Matte UV');
    const [adding, setAdding] = useState(false);

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
                setUploadError(data.message || data.errors?.file?.[0] || 'Upload failed.');
            }
        } catch (err) {
            setUploadError('Failed to upload file.');
        } finally {
            setUploading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) return;
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
                    product_id: selectedProduct.id,
                    quantity: 1,
                    upload_id: uploadedFile?.id ?? null,
                    notes: `Custom Text: ${customText} | Finish: ${selectedFinish}`,
                }),
            });

            if (res.ok) {
                router.reload({ only: ['flash'] });
            }
        } catch (err) {
            // Silently handle
        } finally {
            setAdding(false);
        }
    };

    return (
        <StoreLayout
            title="Custom Design Studio"
            description="Design and upload your customized prints in real-time with PRINTWITHDWARKESH."
        >
            <div className="bg-neutral-950 text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                    Interactive Creator Studio
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2">
                    Create Your Personalized Print
                </h1>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mt-3">
                    Pick your canvas, upload your artwork or photos, add custom typography, and see an instant visual preview.
                </p>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* LEFT: Creator Form Controls */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
                            {/* Step 1: Canvas Type */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2.5">
                                    1. Choose Canvas Product
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {customizableProducts.map((p) => {
                                        const isSelected = selectedProduct?.id === p.id;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setSelectedProduct(p)}
                                                className={`p-3 rounded-2xl border text-left transition ${
                                                    isSelected
                                                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                                                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                                                }`}
                                            >
                                                <p className="font-bold text-xs truncate">{p.name}</p>
                                                <p className="text-[11px] opacity-80 mt-0.5">₹{p.effective_price}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Step 2: Upload Artwork */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                                    2. Upload Photo or Graphic
                                </label>
                                <div className="relative rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-5 text-center hover:border-rose-500 transition">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                    />
                                    <UploadCloud className="size-8 text-rose-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-neutral-900">
                                        Click or drag file to upload (JPG, PNG, WEBP, PDF)
                                    </p>
                                    <p className="text-[11px] text-neutral-400 mt-0.5">Max size: 25MB</p>
                                </div>

                                {uploading && (
                                    <p className="text-xs font-semibold text-neutral-500 mt-2 animate-pulse">
                                        Uploading file to canvas...
                                    </p>
                                )}
                                {uploadError && <p className="text-xs font-bold text-rose-600 mt-2">{uploadError}</p>}
                                {uploadedFile && (
                                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                                        <Check className="size-4 text-emerald-600" />
                                        <span>Uploaded: {uploadedFile.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Step 3: Custom Text */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                                    3. Custom Text / Monogram
                                </label>
                                <input
                                    type="text"
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    placeholder="Enter your custom message or quote..."
                                    className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            {/* Step 4: Finish */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                                    4. Premium Coating & Finish
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['Archival Matte UV', 'Glossy Pearl Luster', 'Metallic Gold Foil'].map((f) => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() => setSelectedFinish(f)}
                                            className={`rounded-full px-4 py-2 text-xs font-bold border transition ${
                                                selectedFinish === f
                                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                                            }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add to Bag CTA */}
                            <button
                                onClick={handleAddToCart}
                                disabled={adding || !selectedProduct}
                                className="w-full rounded-full bg-gradient-to-r from-rose-600 to-amber-600 py-4 text-sm font-extrabold text-white shadow-lg hover:brightness-110 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="size-4" />
                                <span>
                                    {adding
                                        ? 'Adding Creation to Bag...'
                                        : `Add Custom Creation to Bag (₹${selectedProduct?.effective_price ?? 0})`}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Live Visual Canvas */}
                    <div className="lg:col-span-6 flex flex-col items-center">
                        <div className="relative w-full max-w-md aspect-square rounded-3xl bg-neutral-950 p-6 border border-neutral-800 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                                <span>LIVE STUDIO PREVIEW</span>
                            </div>

                            <div className="relative size-64 sm:size-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-neutral-700/50 flex items-center justify-center bg-neutral-900">
                                {uploadedFile?.is_image ? (
                                    <img
                                        src={uploadedFile.url}
                                        alt="Design Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={
                                            selectedProduct?.primary_image_url ||
                                            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85'
                                        }
                                        alt="Canvas Base"
                                        className="h-full w-full object-cover opacity-80"
                                    />
                                )}

                                {customText && (
                                    <div className="absolute inset-x-4 bottom-6 rounded-xl bg-black/70 backdrop-blur-md p-3 text-center border border-white/20">
                                        <p className="font-extrabold text-sm sm:text-base tracking-widest text-white uppercase drop-shadow-md truncate">
                                            {customText}
                                        </p>
                                        <span className="text-[9px] font-semibold text-rose-300 uppercase tracking-widest">
                                            PRINTWITHDWARKESH • {selectedFinish}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="mt-4 text-xs text-neutral-400 text-center">
                                High-definition Japanese archival pigment & UV inks guaranteed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
