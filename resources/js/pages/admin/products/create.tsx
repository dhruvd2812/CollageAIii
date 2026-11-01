import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Plus,
    Save,
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

interface OptionValueForm {
    label: string;
    value: string;
    price_adjustment: number;
}

interface OptionForm {
    name: string;
    code: string;
    type: string;
    is_required: boolean;
    values: OptionValueForm[];
}

interface Props {
    categories: Category[];
}

export default function AdminProductCreate({ categories }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const { data, setData, post, processing, errors } = useForm({
        category_id: categories[0]?.id ? String(categories[0].id) : '',
        name: '',
        sku: '',
        short_description: '',
        description: '',
        base_price: 499,
        sale_price: '' as string | number,
        manage_stock: true,
        stock_quantity: 50,
        low_stock_threshold: 5,
        status: 'active',
        is_featured: false,
        is_customizable: true,
        images: [] as File[],
        options: [
            {
                name: 'Size',
                code: 'size',
                type: 'select',
                is_required: true,
                values: [
                    { label: 'Standard', value: 'standard', price_adjustment: 0 },
                ],
            },
        ] as OptionForm[],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData('images', filesArray);

            const previews = filesArray.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
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

    function updateOption(idx: number, field: keyof OptionForm, val: any) {
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
        field: keyof OptionValueForm,
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
        post('/admin/products', {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout title="Add Product">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/products"
                        className="flex size-9 items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-xs transition"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Add New Product</h1>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Create a new custom-printed merchandise or physical gift item.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left (2 Columns) — Information, Options, Images */}
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
                                placeholder="e.g. Personalized Ceramic Coffee Mug"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
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
                                    placeholder="Leave blank for automatic SKU"
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
                                placeholder="e.g. Glossy finish 325ml ceramic mug with heat-resistant print"
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
                                placeholder="Write specifications, printing dimensions, wash care, material info..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full text-xs rounded-xl border border-neutral-200 p-3 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Images Upload */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-1">Product Images</h2>
                        <p className="text-xs text-neutral-500">
                            Upload high-resolution images (JPEG, PNG, WEBP up to 10MB each).
                        </p>

                        <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-neutral-400 transition bg-neutral-50/50">
                            <input
                                type="file"
                                id="image-upload"
                                multiple
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                <Upload className="size-8 text-neutral-400 mb-2" />
                                <span className="text-xs font-bold text-neutral-800">
                                    Click to select images or drag and drop
                                </span>
                                <span className="text-[10px] text-neutral-400 mt-1">
                                    First uploaded image will be set as Primary
                                </span>
                            </label>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        {i === 0 && (
                                            <span className="absolute bottom-1 left-1 bg-neutral-900/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
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
                                    Add options such as Size, Finish, Paper Quality, Print Sides with price adjustments.
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
                            <p className="text-xs text-neutral-400 italic py-4">No custom options added yet.</p>
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
                                                        Option Name (e.g. Size, Paper Quality)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={opt.name}
                                                        onChange={(e) => updateOption(optIdx, 'name', e.target.value)}
                                                        placeholder="e.g. Size"
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
                                                        placeholder="e.g. size"
                                                        className="w-full text-xs rounded-xl border border-neutral-200 px-3 py-2 bg-white font-mono"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                                                        Option Type
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
                                                id={`req-${optIdx}`}
                                                checked={opt.is_required}
                                                onChange={(e) => updateOption(optIdx, 'is_required', e.target.checked)}
                                                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                            />
                                            <label htmlFor={`req-${optIdx}`} className="text-xs text-neutral-700 cursor-pointer">
                                                Required option before adding to cart
                                            </label>
                                        </div>

                                        {/* Values & Price Adjustments */}
                                        <div className="space-y-2 pt-2 border-t border-neutral-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                                                    Choice Values &amp; Price Adjustments (₹)
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
                                                            placeholder="Label (e.g. A3)"
                                                            value={val.label}
                                                            onChange={(e) => updateOptionValue(optIdx, valIdx, 'label', e.target.value)}
                                                            className="flex-1 text-xs rounded-xl border border-neutral-200 px-3 py-1.5 bg-white"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Key (e.g. a3)"
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
                                                                placeholder="0"
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
                            <p className="text-[10px] text-neutral-400 mt-1">
                                If specified lower than Base Price, the product will show as discounted.
                            </p>
                            {errors.sale_price && <p className="text-xs text-red-500 mt-1">{errors.sale_price}</p>}
                        </div>
                    </div>

                    {/* Stock & Inventory */}
                    <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
                        <h2 className="text-base font-extrabold text-neutral-900 mb-1">Inventory Management</h2>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="manage_stock"
                                checked={data.manage_stock}
                                onChange={(e) => setData('manage_stock', e.target.checked)}
                                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                            />
                            <label htmlFor="manage_stock" className="text-xs font-bold text-neutral-800 cursor-pointer">
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

                    {/* Status & Options */}
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
                                    id="is_customizable"
                                    checked={data.is_customizable}
                                    onChange={(e) => setData('is_customizable', e.target.checked)}
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                />
                                <label htmlFor="is_customizable" className="text-xs text-neutral-700 cursor-pointer">
                                    Requires custom artwork / design upload
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                />
                                <label htmlFor="is_featured" className="text-xs text-neutral-700 cursor-pointer">
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
                            {processing ? 'Publishing Product...' : 'Publish Product'}
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

