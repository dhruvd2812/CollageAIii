import { useForm, usePage } from '@inertiajs/react';
import { Bell, Mail, Megaphone } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';
import CustomerAccountLayout from '@/layouts/customer-account-layout';

interface Props {
    preferences: {
        order_updates_enabled: boolean;
        marketing_enabled: boolean;
    };
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (val: boolean) => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                checked ? 'bg-neutral-900' : 'bg-neutral-300'
            }`}
        >
            <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    );
}

export default function EmailPreferencesPage({ preferences }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const form = useForm({
        order_updates_enabled: preferences.order_updates_enabled,
        marketing_enabled: preferences.marketing_enabled,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        form.put('/account/email-preferences', { preserveScroll: true });
    }

    return (
        <CustomerAccountLayout title="Email Notifications" description="Control which emails you receive.">
            <form onSubmit={handleSubmit}>
                <div className="rounded-3xl bg-white border border-neutral-200/80 shadow-xs p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-extrabold text-neutral-900">Notification Preferences</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                            Choose which email notifications you'd like to receive from PRINTWITHDWARKESH.
                        </p>
                    </div>

                    <div className="space-y-1">
                        {/* Order Updates */}
                        <div className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-100 p-5 hover:bg-neutral-50/50 transition">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 shrink-0">
                                    <Mail className="size-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">Order Updates</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        Receive email notifications about your order status — confirmation, shipping updates, and delivery.
                                    </p>
                                </div>
                            </div>
                            <Toggle
                                checked={form.data.order_updates_enabled}
                                onChange={(val) => form.setData('order_updates_enabled', val)}
                                disabled={form.processing}
                            />
                        </div>

                        {/* Marketing */}
                        <div className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-100 p-5 hover:bg-neutral-50/50 transition">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 shrink-0">
                                    <Megaphone className="size-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">Marketing &amp; Promotions</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        Receive occasional emails about new products, special offers, and exclusive deals.
                                    </p>
                                </div>
                            </div>
                            <Toggle
                                checked={form.data.marketing_enabled}
                                onChange={(val) => form.setData('marketing_enabled', val)}
                                disabled={form.processing}
                            />
                        </div>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end mt-6 pt-5 border-t border-neutral-100">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition disabled:opacity-50 shadow-xs"
                        >
                            <Bell className="size-3.5" />
                            {form.processing ? 'Saving…' : 'Save Preferences'}
                        </button>
                    </div>
                </div>
            </form>
        </CustomerAccountLayout>
    );
}
