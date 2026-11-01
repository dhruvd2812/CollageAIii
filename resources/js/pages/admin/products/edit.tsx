import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Plus,
    Save,
    Star,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminLayout from '@/layouts/admin-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface ProductOptionValue {
    id?: number;
    label: string;
    value: string;
    price_adjustment: number;
}

interface ProductOption {
    id?: number;
    name: string;
    code: string;
    type: string;
    is_required: boolean;
    values: ProductOptionValue[];
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    sku: string;
    short_description: string | null;
    description: string | null;
    base_price: number;
    sale_price: number | null;
    manage_stock: boolean;
    stock_quantity: number;
    low_stock_threshold: number;
    status: string;
    is_featured: boolean;
    is_customizable: boolean;
    images: ProductImage[];
    all_options: ProductOption[];
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function AdminProductEdit({ product, categories }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Initial options conversion
    const initialOptions = (product.all_options || []).map((opt) => ({
        name: opt.name,
        code: opt.code,
        type: opt.type,
        is_required: Boolean(opt.is_required),
        values: (opt.values || []).map((val) => ({
            label: val.label,
            value: val.value,
            price_adjustment: val.price_adjustment,
        })),
    }));

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        category_id: String(product.category_id),
        name: product.name,
        sku: product.sku,
        short_description: product.short_description || '',
        description: product.description || '',
        base_price: product.base_price,
        sale_price: product.sale_price || ('' as string | number),
        manage_stock: product.manage_stock,
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,
        status: product.status,
        is_featured: product.is_featured,
        is_customizable: product.is_customizable,
        images: [] as File[],
        remove_image_ids: [] as number[],
        primary_image_id: product.images.find((i) => i.is_primary)?.id || null,
        options: initialOptions,
    });

    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images || []);

    function handleNewImages(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData('images', filesArray);

            const previews = filesArray.map((file) => URL.createObjectURL(file));
            setNewImagePreviews(previews);
        }
    }

    function removeExistingImage(imgId: number) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
        setData('remove_image_ids', [...data.remove_image_ids, imgId]);
        if (data.primary_image_id === imgId) {
            const remaining = existingImages.filter((img) => img.id !== imgId);
            setData('primary_image_id', remaining[0]?.id || null);
        }
    }

    function setAsPrimaryImage(imgId: number) {
        setData('primary_image_id', imgId);
        setExistingImages((prev) =>
            prev.map((img) => ({
                ...img,
                is_primary: img.id === imgId,
            }))
        );
    }

    // Dynamic Option Handlers
    function addOption() {
        setData('options', [
            ...data.options,
            {
                name: '',
                code: '',
                type: 'select',
                is_required: false,
                values: [{ label: '', value: '', price_adjustment: 0 }],
            },
        ]);
    }

    function removeOption(idx: number) {
        setData('options', data.options.filter((_, i) => i !== idx));
    }

    function updateOption(idx: number, field: string, val: any) {
        const next = [...data.options];
        next[idx] = { ...next[idx], [field]: val };
        if (field === 'name' && !next[idx].code) {
            next[idx].code = String(val).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        }
        setData('options', next);
    }

    function addOptionValue(optIdx: number) {
        const next = [...data.options];
        next[optIdx].values.push({ label: '', value: '', price_adjustment: 0 });
        setData('options', next);
    }

    function removeOptionValue(optIdx: number, valIdx: number) {
        const next = [...data.options];
        next[optIdx].values = next[optIdx].values.filter((_, i) => i !== valIdx);
        setData('options', next);
    }

    function updateOptionValue(
        optIdx: number,
        valIdx: number,
        field: string,
        val: any
    ) {
        const next = [...data.options];
        next[optIdx].values[valIdx] = {
            ...next[optIdx].values[valIdx],
            [field]: val,
        };
        if (field === 'label' && !next[optIdx].values[valIdx].value) {
            next[optIdx].values[valIdx].value = String(val).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        }
        setData('options', next);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout title={`Edit Product: ${product.name}`}>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/products"
                        className="flex size-9 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs transition"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                            Edit Product: {product.name}
                        </h1>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Update pricing, inventory, images, custom printing options, or status.
                        </p>
                    </div>
                </div>

                <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100"
                >
                    View in Store ↗
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left (2 Columns) — Basic Info, Images, Options */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-2">Basic Details</h2>

                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-bold"
                                required
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    required
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1">
                                    SKU (Stock Keeping Unit)
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                                />
                                {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                                Short Summary / Tagline
                            </label>
                            <input
                                type="text"
                                value={data.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                                className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            {errors.short_description && <p className="text-xs text-red-500 mt-1">{errors.short_description}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                                Detailed Product Description
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full text-xs rounded-xl border border-neutral-200 p-3 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Image Management */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-1">Image Gallery</h2>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-2">
                                    Current Images (Click star to set Primary):
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                                                img.id === data.primary_image_id
                                                    ? 'border-neutral-900 shadow-sm'
                                                    : 'border-neutral-200'
                                            }`}
                                        >
                                            <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setAsPrimaryImage(img.id)}
                                                className={`absolute top-1 left-1 p-1 rounded-md transition ${
                                                    img.id === data.primary_image_id
                                                        ? 'bg-neutral-900 text-amber-400'
                                                        : 'bg-white/80 text-neutral-500 hover:text-amber-500'
                                                }`}
                                                title="Set as Primary"
                                            >
                                                <Star className="size-3 fill-current" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(img.id)}
                                                className="absolute top-1 right-1 p-1 bg-white/80 text-neutral-600 hover:text-red-600 rounded-md transition"
                                                title="Delete Image"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload More Images */}
                        <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-neutral-400 transition bg-neutral-50/50">
                            <input
                                type="file"
                                id="image-upload-edit"
                                multiple
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleNewImages}
                                className="hidden"
                            />
                            <label htmlFor="image-upload-edit" className="cursor-pointer flex flex-col items-center">
                                <Upload className="size-8 text-neutral-400 mb-2" />
                                <span className="text-xs font-bold text-neutral-800">
                                    Upload additional images
                                </span>
                                <span className="text-[10px] text-neutral-400 mt-1">
                                    JPEG, PNG, WEBP up to 10MB
                                </span>
                            </label>
                        </div>

                        {newImagePreviews.length > 0 && (
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-2">
                                    Newly selected to upload:
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {newImagePreviews.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200">
                                            <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
                    </div>

                    {/* Dynamic Product Options */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-extrabold text-neutral-900">Custom Options &amp; Variants</h2>
                                <p className="text-xs text-neutral-500">
                                    Configure option names, selection types, and value price adjustments.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addOption}
                                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 transition"
                            >
                                <Plus className="size-3.5" /> Add Option
                            </button>
                        </div>

                        {data.options.length === 0 ? (
                            <p className="text-xs text-neutral-400 italic py-4">No custom options configured.</p>
                        ) : (
                            <div className="space-y-6">
                                {data.options.map((opt, optIdx) => (
                                    <div
                                        key={optIdx}
                                        className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                                                        Option Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={opt.name}
                                                        onChange={(e) => updateOption(optIdx, 'name', e.target.value)}
                                                        className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2 bg-white"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                                                        Code (Identifier)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={opt.code}
                                                        onChange={(e) => updateOption(optIdx, 'code', e.target.value)}
                                                        className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2 bg-white font-mono"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                                                        Type
                                                    </label>
                                                    <select
                                                        value={opt.type}
                                                        onChange={(e) => updateOption(optIdx, 'type', e.target.value)}
                                                        className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2 bg-white"
                                                    >
                                                        <option value="select">Select / Dropdown</option>
                                                        <option value="radio">Radio Buttons</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeOption(optIdx)}
                                                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition"
                                                title="Remove Option"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`req-edit-${optIdx}`}
                                                checked={opt.is_required}
                                                onChange={(e) => updateOption(optIdx, 'is_required', e.target.checked)}
                                                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                            />
                                            <label htmlFor={`req-edit-${optIdx}`} className="text-xs text-neutral-700 cursor-pointer">
                                                Required option
                                            </label>
                                        </div>

                                        {/* Values & Price Adjustments */}
                                        <div className="space-y-2 pt-2 border-t border-neutral-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                                    Values &amp; Price Adjustments (₹)
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => addOptionValue(optIdx)}
                                                    className="text-[11px] font-bold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
                                                >
                                                    <Plus className="size-3" /> Add Value
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {opt.values.map((val, valIdx) => (
                                                    <div key={valIdx} className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Label"
                                                            value={val.label}
                                                            onChange={(e) => updateOptionValue(optIdx, valIdx, 'label', e.target.value)}
                                                            className="flex-1 text-xs rounded-xl border border-neutral-200 px-3 py-1.5 bg-white"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Key"
                                                            value={val.value}
                                                            onChange={(e) => updateOptionValue(optIdx, valIdx, 'value', e.target.value)}
                                                            className="w-28 text-xs rounded-xl border border-neutral-200 px-3 py-1.5 bg-white font-mono"
                                                            required
                                                        />
                                                        <div className="relative w-32">
                                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                                                                +₹
                                                            </span>
                                                            <input
                                                                type="number"
                                                                value={val.price_adjustment}
                                                                onChange={(e) => updateOptionValue(optIdx, valIdx, 'price_adjustment', parseInt(e.target.value) || 0)}
                                                                className="w-full text-xs rounded-xl border border-neutral-200 pl-7 pr-3 py-1.5 bg-white"
                                                            />
                                                        </div>
                                                        {opt.values.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOptionValue(optIdx, valIdx)}
                                                                className="text-neutral-400 hover:text-red-600 p-1"
                                                            >
                                                                <X className="size-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right (1 Column) — Pricing, Stock, Flags, Submit */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-1">Pricing</h2>

                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                                Selling Base Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', parseInt(e.target.value) || 0)}
                                className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-bold"
                                required
                            />
                            {errors.base_price && <p className="text-xs text-red-500 mt-1">{errors.base_price}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                                Discounted Sale Price (₹) (Optional)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Lower than base price if on discount"
                                value={data.sale_price}
                                onChange={(e) => setData('sale_price', e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            {errors.sale_price && <p className="text-xs text-red-500 mt-1">{errors.sale_price}</p>}
                        </div>
                    </div>

                    {/* Stock & Inventory */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-1">Inventory Management</h2>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="manage_stock_edit"
                                checked={data.manage_stock}
                                onChange={(e) => setData('manage_stock', e.target.checked)}
                                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                            />
                            <label htmlFor="manage_stock_edit" className="text-xs font-bold text-neutral-800 cursor-pointer">
                                Track Stock Quantity
                            </label>
                        </div>

                        {data.manage_stock && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                                        Current Stock Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                        className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-bold"
                                        required
                                    />
                                    {errors.stock_quantity && <p className="text-xs text-red-500 mt-1">{errors.stock_quantity}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                                        Low Stock Alert Threshold
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.low_stock_threshold}
                                        onChange={(e) => setData('low_stock_threshold', parseInt(e.target.value) || 0)}
                                        className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Visibility & Flags */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-1">Visibility &amp; Flags</h2>

                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 capitalize"
                            >
                                <option value="active">Active (Visible in Store)</option>
                                <option value="draft">Draft (Hidden)</option>
                                <option value="inactive">Inactive</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_customizable_edit"
                                    checked={data.is_customizable}
                                    onChange={(e) => setData('is_customizable', e.target.checked)}
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                />
                                <label htmlFor="is_customizable_edit" className="text-xs text-neutral-700 cursor-pointer">
                                    Requires custom artwork / design upload
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured_edit"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                />
                                <label htmlFor="is_featured_edit" className="text-xs text-neutral-700 cursor-pointer">
                                    Feature on Homepage &amp; Top of Category
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-2xl bg-neutral-900 text-white text-xs font-bold py-3 hover:bg-rose-600 transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                        >
                            <Save className="size-4" />
                            {processing ? 'Saving Changes...' : 'Update Product'}
                        </button>
                        <Link
                            href="/admin/products"
                            className="block text-center rounded-2xl bg-neutral-100 text-neutral-600 text-xs font-bold py-2.5 hover:bg-neutral-200 transition"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

