import { router, useForm, usePage } from '@inertiajs/react';
import { Check, Edit2, MapPin, Plus, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import CustomerAccountLayout from '@/layouts/customer-account-layout';

interface Address {
    id: number;
    label: string;
    recipient_name: string;
    phone: string;
    line_one: string;
    line_two: string | null;
    landmark: string | null;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
    is_default: boolean;
}

interface Props {
    addresses: Address[];
}

const emptyForm = {
    label: 'Home',
    recipient_name: '',
    phone: '',
    line_one: '',
    line_two: '',
    landmark: '',
    city: '',
    state: '',
    postal_code: '',
    country_code: 'IN',
    is_default: false,
};

export default function AddressesPage({ addresses }: Props) {
    const { flash } = usePage().props as any;
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setShowAdd(false);
            setEditingId(null);
        }
    }, [flash]);

    const addForm = useForm({ ...emptyForm });
    const editForm = useForm({ ...emptyForm });

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        addForm.post('/account/addresses', { preserveScroll: true });
    }

    function startEdit(addr: Address) {
        setEditingId(addr.id);
        setShowAdd(false);
        editForm.setData({
            label: addr.label || 'Home',
            recipient_name: addr.recipient_name,
            phone: addr.phone,
            line_one: addr.line_one,
            line_two: addr.line_two || '',
            landmark: addr.landmark || '',
            city: addr.city,
            state: addr.state,
            postal_code: addr.postal_code,
            country_code: addr.country_code || 'IN',
            is_default: addr.is_default,
        });
    }

    function handleEdit(e: FormEvent, id: number) {
        e.preventDefault();
        editForm.put(`/account/addresses/${id}`, { preserveScroll: true });
    }

    function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this address?')) return;
        router.delete(`/account/addresses/${id}`, { preserveScroll: true });
    }

    function handleSetDefault(id: number) {
        router.post(`/account/addresses/${id}/default`, {}, { preserveScroll: true });
    }

    function renderForm(
        form: ReturnType<typeof useForm<typeof emptyForm>>,
        onSubmit: (e: FormEvent) => void,
        onCancel: () => void,
        submitLabel: string,
    ) {
        return (
            <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Label</label>
                        <select
                            value={form.data.label}
                            onChange={(e) => form.setData('label', e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                        >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Recipient Name *</label>
                        <input
                            type="text"
                            value={form.data.recipient_name}
                            onChange={(e) => form.setData('recipient_name', e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                            required
                        />
                        {form.errors.recipient_name && <p className="text-xs text-red-600 mt-1">{form.errors.recipient_name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Phone *</label>
                        <input
                            type="tel"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                            required
                        />
                        {form.errors.phone && <p className="text-xs text-red-600 mt-1">{form.errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Address Line 1 *</label>
                        <input
                            type="text"
                            value={form.data.line_one}
                            onChange={(e) => form.setData('line_one', e.target.value)}
                            placeholder="House/Flat, Building, Street"
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                            required
                        />
                        {form.errors.line_one && <p className="text-xs text-red-600 mt-1">{form.errors.line_one}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Address Line 2</label>
                        <input
                            type="text"
                            value={form.data.line_two}
                            onChange={(e) => form.setData('line_two', e.target.value)}
                            placeholder="Area, Colony (optional)"
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Landmark</label>
                        <input
                            type="text"
                            value={form.data.landmark}
                            onChange={(e) => form.setData('landmark', e.target.value)}
                            placeholder="Near... (optional)"
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">City *</label>
                        <input
                            type="text"
                            value={form.data.city}
                            onChange={(e) => form.setData('city', e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                            required
                        />
                        {form.errors.city && <p className="text-xs text-red-600 mt-1">{form.errors.city}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">State *</label>
                        <input
                            type="text"
                            value={form.data.state}
                            onChange={(e) => form.setData('state', e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                            required
                        />
                        {form.errors.state && <p className="text-xs text-red-600 mt-1">{form.errors.state}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">Pincode *</label>
                        <input
                            type="text"
                            value={form.data.postal_code}
                            onChange={(e) => form.setData('postal_code', e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition"
                            required
                        />
                        {form.errors.postal_code && <p className="text-xs text-red-600 mt-1">{form.errors.postal_code}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.data.is_default}
                                onChange={(e) => form.setData('is_default', e.target.checked)}
                                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                            />
                            <span className="text-xs font-bold text-neutral-700">Set as default address</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50"
                    >
                        {form.processing ? 'Saving…' : submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full bg-neutral-100 px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }

    return (
        <CustomerAccountLayout title="Saved Addresses" description="Manage your delivery addresses.">
            <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-neutral-900">Your Addresses</h3>
                    {!showAdd && (
                        <button
                            onClick={() => { setShowAdd(true); setEditingId(null); addForm.reset(); }}
                            className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition"
                        >
                            <Plus className="size-3.5" /> Add New
                        </button>
                    )}
                </div>

                {/* Add Form */}
                {showAdd && (
                    <div className="mb-6">
                        {renderForm(addForm, handleAdd, () => setShowAdd(false), 'Save Address')}
                    </div>
                )}

                {/* Address Cards */}
                {addresses.length === 0 && !showAdd ? (
                    <div className="text-center py-16">
                        <MapPin className="size-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-sm font-bold text-neutral-500">No saved addresses</p>
                        <p className="text-xs text-neutral-400 mt-1">Add an address for faster checkout.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <div key={addr.id}>
                                {editingId === addr.id ? (
                                    renderForm(
                                        editForm,
                                        (e) => handleEdit(e, addr.id),
                                        () => setEditingId(null),
                                        'Update Address',
                                    )
                                ) : (
                                    <div className="rounded-2xl border border-neutral-100 p-5 hover:border-neutral-200 transition">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-bold text-neutral-900">
                                                        {addr.recipient_name}
                                                    </p>
                                                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                                                        {addr.label}
                                                    </span>
                                                    {addr.is_default && (
                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-600">
                                                    {addr.line_one}
                                                    {addr.line_two ? `, ${addr.line_two}` : ''}
                                                </p>
                                                {addr.landmark && (
                                                    <p className="text-xs text-neutral-500">Near {addr.landmark}</p>
                                                )}
                                                <p className="text-xs text-neutral-600">
                                                    {addr.city}, {addr.state} – {addr.postal_code}
                                                </p>
                                                <p className="text-xs text-neutral-500 mt-1">{addr.phone}</p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {!addr.is_default && (
                                                    <button
                                                        onClick={() => handleSetDefault(addr.id)}
                                                        className="rounded-full bg-neutral-50 px-3 py-1.5 text-[10px] font-bold text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                                        title="Set as default"
                                                    >
                                                        <Check className="size-3.5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => startEdit(addr)}
                                                    className="rounded-full bg-neutral-50 px-3 py-1.5 text-[10px] font-bold text-neutral-600 hover:bg-blue-50 hover:text-blue-700 transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="size-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(addr.id)}
                                                    className="rounded-full bg-neutral-50 px-3 py-1.5 text-[10px] font-bold text-neutral-600 hover:bg-red-50 hover:text-red-700 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
