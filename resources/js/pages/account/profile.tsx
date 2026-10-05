import { useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';
import CustomerAccountLayout from '@/layouts/customer-account-layout';

interface Props {
    user: {
        name: string;
        email: string;
        phone: string | null;
    };
}

export default function ProfilePage({ user }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const form = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.put('/account/profile', {
            preserveScroll: true,
            onSuccess: () => {
                form.setData('current_password', '');
                form.setData('new_password', '');
                form.setData('new_password_confirmation', '');
            },
        });
    }

    return (
        <CustomerAccountLayout title="Profile & Security" description="Update your personal information and password.">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                    <h3 className="text-lg font-extrabold text-neutral-900 mb-5">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Full Name *</label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition"
                            />
                            {form.errors.name && <p className="text-xs text-red-600 mt-1">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Email Address *</label>
                            <input
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition"
                            />
                            {form.errors.email && <p className="text-xs text-red-600 mt-1">{form.errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition"
                            />
                            {form.errors.phone && <p className="text-xs text-red-600 mt-1">{form.errors.phone}</p>}
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                    <h3 className="text-lg font-extrabold text-neutral-900 mb-2">Change Password</h3>
                    <p className="text-xs text-neutral-500 mb-5">Leave blank if you don't want to change your password.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Current Password</label>
                            <input
                                type="password"
                                value={form.data.current_password}
                                onChange={(e) => form.setData('current_password', e.target.value)}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition"
                            />
                            {form.errors.current_password && <p className="text-xs text-red-600 mt-1">{form.errors.current_password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={form.data.new_password}
                                onChange={(e) => form.setData('new_password', e.target.value)}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition"
                            />
                            {form.errors.new_password && <p className="text-xs text-red-600 mt-1">{form.errors.new_password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                value={form.data.new_password_confirmation}
                                onChange={(e) => form.setData('new_password_confirmation', e.target.value)}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50 shadow-xs"
                    >
                        <Save className="size-4" />
                        {form.processing ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </CustomerAccountLayout>
    );
}
