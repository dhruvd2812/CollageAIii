import { Link, usePage } from '@inertiajs/react';
import {
    Heart,
    Layers,
    Lock,
    LogOut,
    Mail,
    MapPin,
    Package,
    Shield,
    User as UserIcon,
} from 'lucide-react';
import React, { ReactNode } from 'react';
import StoreLayout from '@/layouts/store-layout';

interface AccountLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

export default function CustomerAccountLayout({ children, title, description }: AccountLayoutProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};
    const url = usePage().url;

    const navLinks = [
        { title: 'Overview', href: '/account', icon: Layers, active: url === '/account' },
        { title: 'My Orders', href: '/account/orders', icon: Package, active: url.startsWith('/account/orders') },
        { title: 'Saved Addresses', href: '/account/addresses', icon: MapPin, active: url === '/account/addresses' },
        { title: 'My Wishlist', href: '/account/wishlist', icon: Heart, active: url === '/account/wishlist' },
        { title: 'Profile & Security', href: '/account/profile', icon: UserIcon, active: url === '/account/profile' },
        { title: 'Email Notifications', href: '/account/email-preferences', icon: Mail, active: url === '/account/email-preferences' },
    ];

    return (
        <StoreLayout title={title} description={description}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Profile Banner */}
                <div className="mb-8 rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-900 text-white font-extrabold text-xl shadow-md">
                            {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-extrabold text-xl sm:text-2xl text-neutral-900">
                                    {auth.user?.name}
                                </h1>
                                {auth.user?.isAdmin && (
                                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {auth.user?.email} {auth.user?.phone && `• ${auth.user.phone}`}
                            </p>
                        </div>
                    </div>

                    {auth.user?.isAdmin && (
                        <Link
                            href="/admin"
                            className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-rose-600 transition shadow-xs"
                        >
                            Open Admin Portal →
                        </Link>
                    )}
                </div>

                {/* Account Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-3">
                        <div className="rounded-3xl bg-white p-3 border border-neutral-200/80 shadow-xs space-y-1">
                            {navLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                                            item.active
                                                ? 'bg-neutral-900 text-white shadow-xs'
                                                : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}

                            <div className="my-2 border-t border-neutral-100" />

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                            >
                                <LogOut className="size-4" />
                                <span>Sign Out</span>
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">{children}</div>
                </div>
            </div>
        </StoreLayout>
    );
}
