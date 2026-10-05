import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Check,
    ChevronRight,
    Clock,
    Flame,
    Layers,
    PackageCheck,
    Palette,
    Printer,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    UploadCloud,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/store/product-card';
import StoreLayout from '@/layouts/store-layout';

interface HomeProps {
    categories: Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        image_path: string;
    }>;
    featuredProducts: any[];
    popularProducts: any[];
}

export default function Home({ categories = [], featuredProducts = [], popularProducts = [] }: HomeProps) {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <StoreLayout
            title="Your Ideas. Beautifully Printed."
            description="Create personalised products, upload your design, and order custom prints online with PRINTWITHDWARKESH."
        >
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
                <div className="absolute top-1/4 -left-40 size-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 -right-40 size-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                        {/* Hero Left Content */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 border border-neutral-200 shadow-xs">
                                <span className="flex size-2 rounded-full bg-rose-500" />
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                                    Custom Print Studio • India
                                </span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-neutral-950 leading-[1.08]">
                                Your Ideas. <br />
                                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                                    Beautifully Printed.
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
                                Create personalised products, upload your design, and order custom prints online.
                                From gallery posters and ceramic mugs to custom t-shirts, visiting cards, and memory gifts.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-bold text-white hover:bg-neutral-800 hover:shadow-lg transition-all duration-200 active:scale-95"
                                >
                                    <span>Shop Now</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href="/custom-design"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-neutral-950 px-6 py-3 text-sm font-bold text-neutral-950 hover:bg-neutral-50 hover:shadow-md transition-all duration-200"
                                >
                                    <Sparkles className="size-4 text-rose-500" />
                                    <span>Create Custom Design</span>
                                </Link>
                            </div>

                            {/* Trust Pillars */}
                            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-200/70">
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="size-3.5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs font-bold text-neutral-900">Fine-Art Quality</p>
                                    <p className="text-[11px] text-neutral-500">2400 DPI Precision</p>
                                </div>
                                <div className="border-l border-neutral-200 pl-4">
                                    <p className="font-extrabold text-neutral-900 text-lg">48 Hr</p>
                                    <p className="text-[11px] text-neutral-500">Express Dispatch</p>
                                </div>
                                <div className="border-l border-neutral-200 pl-4">
                                    <p className="font-extrabold text-neutral-900 text-lg">100%</p>
                                    <p className="text-[11px] text-neutral-500">Delight Guarantee</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Right Visuals */}
                        <div className="lg:col-span-6 relative">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                                    <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85"
                                            alt="Archival Poster Print"
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                            Wall Art
                                        </span>
                                        <h3 className="font-bold text-sm text-neutral-900 truncate">
                                            Archival Matte Posters
                                        </h3>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-neutral-900">From ₹299</span>
                                            <span className="text-xs font-bold text-rose-600">Order →</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10">
                                    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg border border-neutral-100 transition-all duration-300 hover:-translate-y-1.5">
                                        <div className="aspect-square overflow-hidden bg-neutral-100">
                                            <img
                                                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85"
                                                alt="Custom Ceramic Mug"
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-3.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                                Drinkware
                                            </span>
                                            <h3 className="font-bold text-xs text-neutral-900 truncate">
                                                Custom Coffee Mugs
                                            </h3>
                                            <p className="text-xs font-extrabold text-neutral-900 mt-0.5">From ₹349</p>
                                        </div>
                                    </div>

                                    <div className="rounded-3xl bg-neutral-950 p-5 text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-rose-500/30 blur-xl" />
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <Sparkles className="size-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                Self-Design
                                            </span>
                                        </div>
                                        <h4 className="mt-2 text-base font-bold leading-tight">
                                            Upload your photo or logo in seconds.
                                        </h4>
                                        <p className="mt-1 text-xs text-neutral-400">
                                            Ultra-HD UV & archival pigment inks.
                                        </p>
                                        <Link
                                            href="/custom-design"
                                            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300"
                                        >
                                            <span>Open Studio</span>
                                            <ChevronRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. POPULAR CATEGORIES */}
            <section className="py-16 bg-white border-y border-neutral-200/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                                <Sparkles className="size-3.5" />
                                Shop by Category
                            </span>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                Popular Print Collections
                            </h2>
                        </div>
                        <Link href="/shop" className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                            <span>View All Products</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {categories.slice(0, 8).map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#faf8f5] border border-neutral-200/80 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-neutral-300"
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200 mb-4">
                                    <img
                                        src={cat.image_path}
                                        alt={cat.name}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="mt-1 text-xs text-neutral-500 line-clamp-1">{cat.description}</p>
                                <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-200/60">
                                    <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                                        Explore →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURED PRODUCTS */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                            Handcrafted Precision
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                            Featured Custom Products
                        </h2>
                        <p className="mt-3 text-sm text-neutral-600">
                            Our top-rated personalized products customized for individuals and modern brands.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {featuredProducts.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-900 px-8 py-3.5 text-sm font-bold text-neutral-900 hover:bg-neutral-900 hover:text-white transition"
                        >
                            <span>Browse Complete Catalog</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. CUSTOM PRINTING STUDIO SECTION */}
            <section className="py-20 bg-neutral-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 size-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 size-96 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                                <Sparkles className="size-3.5" />
                                Custom Design Studio
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                                Have a Design in Mind? <br />
                                Upload & We'll Print It.
                            </h2>
                            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                                Upload your personal photos, logos, quotes, or illustrations. Choose from fine-art papers,
                                durable ceramics, insulated steel, and organic cotton. We review every design before printing
                                to ensure crisp clarity.
                            </p>
                            <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
                                <p className="flex items-center gap-2.5">
                                    <Check className="size-4 text-emerald-400 shrink-0" />
                                    <span>Supports high-resolution PNG, JPG, WEBP, PDF & SVG</span>
                                </p>
                                <p className="flex items-center gap-2.5">
                                    <Check className="size-4 text-emerald-400 shrink-0" />
                                    <span>Zero minimum order quantity — order 1 piece or 500+</span>
                                </p>
                                <p className="flex items-center gap-2.5">
                                    <Check className="size-4 text-emerald-400 shrink-0" />
                                    <span>Live preview & exact dimension specifications</span>
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href="/custom-design"
                                    className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-extrabold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition"
                                >
                                    <UploadCloud className="size-4" />
                                    <span>Open Custom Studio</span>
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6 flex justify-center">
                            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900">
                                <img
                                    src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=85"
                                    alt="Custom Printing Studio"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <p className="text-white font-extrabold text-base">Archival Pigment & UV Curable Inks</p>
                                    <p className="text-neutral-400 text-xs mt-1">Guaranteed fade-proof for 50+ years.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="py-20 bg-white border-b border-neutral-200/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                            Effortless 4-Step Process
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                            How Custom Printing Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Select Product',
                                desc: 'Pick from posters, ceramic mugs, insulated bottles, apparel, or business cards.',
                            },
                            {
                                step: '02',
                                title: 'Upload & Customise',
                                desc: 'Upload your high-res photo, enter custom text, and choose size or paper finish.',
                            },
                            {
                                step: '03',
                                title: 'Precision Print',
                                desc: 'Our technicians review your files and print using 12-color archival pigment inks.',
                            },
                            {
                                step: '04',
                                title: 'Delivered in 48h',
                                desc: 'Safely packed in multi-layer protective packaging and dispatched to your door.',
                            },
                        ].map((s) => (
                            <div
                                key={s.step}
                                className="relative rounded-3xl bg-[#faf8f5] p-7 border border-neutral-200/80 shadow-xs"
                            >
                                <span className="font-extrabold text-3xl text-rose-600/40">{s.step}</span>
                                <h3 className="mt-3 font-bold text-neutral-900 text-lg">{s.title}</h3>
                                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. RECENTLY ADDED */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                                <Flame className="size-3.5" />
                                Fresh in Catalog
                            </span>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                Recently Added Prints
                            </h2>
                        </div>
                        <Link href="/shop?sort=newest" className="text-sm font-bold text-rose-600 hover:text-rose-700">
                            Explore New Arrivals →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {popularProducts.slice(0, 4).map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. WHY CHOOSE US */}
            <section className="py-20 bg-white border-t border-neutral-200/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                            The Dwarkesh Standard
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                            Why Choose PRINTWITHDWARKESH
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Printer,
                                title: 'Fine-Art Ultra HD Quality',
                                desc: '2400 DPI ultra-high definition printing with archival 12-color pigment and durable UV curable inks.',
                                color: 'text-rose-600 bg-rose-50',
                            },
                            {
                                icon: Sparkles,
                                title: '100% Custom Freedom',
                                desc: 'Order 1 single personalized gift or 10,000 corporate pieces. Zero setup charges or hidden minimums.',
                                color: 'text-amber-600 bg-amber-50',
                            },
                            {
                                icon: Truck,
                                title: '48h Express Dispatch',
                                desc: 'Quick turnaround with multi-layer tamper-proof packaging to ensure your prints arrive pristine.',
                                color: 'text-emerald-600 bg-emerald-50',
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Delight Guarantee',
                                desc: 'If your print is anything less than flawless, we will reprint and ship it free of charge.',
                                color: 'text-indigo-600 bg-indigo-50',
                            },
                        ].map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-3xl bg-[#faf8f5] p-7 border border-neutral-200/80 shadow-xs transition hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div
                                        className={`flex size-12 items-center justify-center rounded-2xl ${item.color} mb-5 shadow-xs`}
                                    >
                                        <IconComp className="size-6" />
                                    </div>
                                    <h3 className="font-bold text-neutral-900 text-lg">{item.title}</h3>
                                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 8. CALL TO ACTION */}
            <section className="py-20 bg-neutral-900 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                            Start Creating Today
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            Ready to Bring Your Vision to Life?
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-400">
                            Join thousands of happy creators, photographers, and businesses who trust PRINTWITHDWARKESH.
                        </p>
                        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/shop"
                                className="rounded-full bg-rose-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-rose-500 shadow-lg transition"
                            >
                                Shop Collection
                            </Link>
                            <Link
                                href="/custom-design"
                                className="rounded-full bg-neutral-800 border border-neutral-700 px-8 py-3.5 text-sm font-bold text-white hover:bg-neutral-700 transition"
                            >
                                Design Custom Print
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </StoreLayout>
    );
}
