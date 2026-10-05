import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Layers,
    LayoutDashboard,
    LogOut,
    Package,
    Shield,
    ShoppingBag,
    Users,
} from 'lucide-react';
import React, { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const pageProps = usePage().props as any;
    const auth = pageProps?.auth || {};
    const url = usePage().url;

    return (
        <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans antialiased flex flex-col">
            <Head>
                <title>{title} | Admin Portal - PRINTWITHDWARKESH</title>
            </Head>

            {/* Admin Header */}
            <header className="sticky top-0 z-40 bg-neutral-900 text-white border-b border-neutral-800 shadow-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                                <AppLogoIcon className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold tracking-tight text-white text-base leading-none">
                                    PRINTWITHDWARKESH
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mt-0.5">
                                    Admin Portal
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-2 text-xs font-bold">
                            <Link
                                href="/admin"
                                className={`rounded-full px-3.5 py-1.5 transition ${
                                    url === '/admin'
                                        ? 'bg-neutral-800 text-white'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/orders"
                                className={`rounded-full px-3.5 py-1.5 transition ${
                                    url.startsWith('/admin/orders')
                                        ? 'bg-neutral-800 text-white'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Orders & Fulfillment
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3.5 py-1.5 text-xs font-bold text-neutral-300 hover:text-white hover:bg-neutral-700 transition"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Storefront</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-400 border-l border-neutral-800 pl-3">
                            <span>{auth.user?.name}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <main className="flex-1 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
