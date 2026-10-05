import { Link } from '@inertiajs/react';
import { Award, Check, Heart, Layers, Printer, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import StoreLayout from '@/layouts/store-layout';

export default function AboutPage() {
    return (
        <StoreLayout
            title="About PRINTWITHDWARKESH"
            description="Discover the story behind PRINTWITHDWARKESH, our fine-art printing studio, and commitment to custom printing craftsmanship."
        >
            {/* Hero Header */}
            <div className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                        Our Story & Passion
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Crafting Tangible Moments with Precision Printing
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                        PRINTWITHDWARKESH was born out of a desire to make commercial-grade, archival custom printing
                        accessible to creators, homeowners, and businesses across India.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-neutral-700">
                <div className="space-y-4">
                    <h2 className="text-2xl font-extrabold text-neutral-950">The PRINTWITHDWARKESH Standard</h2>
                    <p className="text-sm leading-relaxed">
                        We believe that your memories and creative artwork deserve more than standard desktop printing.
                        Every piece produced in our studio uses museum-quality archival paper stocks (300 to 450 GSM),
                        fade-resistant Japanese pigment inks, and durable UV curable coatings that preserve color fidelity
                        for decades.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-xs">
                        <Printer className="size-6 text-rose-600 mb-3" />
                        <h3 className="font-extrabold text-sm text-neutral-900">Archival 2400 DPI</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                            12-color ultra-HD digital print engines ensuring sharp details and smooth gradients.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-xs">
                        <Sparkles className="size-6 text-amber-600 mb-3" />
                        <h3 className="font-extrabold text-sm text-neutral-900">Zero Minimums</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                            Order 1 single personalized gift or 5,000 corporate identity packages.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-xs">
                        <Truck className="size-6 text-emerald-600 mb-3" />
                        <h3 className="font-extrabold text-sm text-neutral-900">Safe Delivery</h3>
                        <p className="text-xs text-neutral-500 mt-1">
                            Heavy-duty rigid mailing tubes, reinforced corner protectors, and bubble wrap.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-extrabold text-neutral-950">Our Product Philosophy</h2>
                    <p className="text-sm leading-relaxed">
                        Whether you are decorating your living space with customized gallery wall posters, gifting a
                        personalized Spotify acrylic lamp to a loved one, or branding your company with soft-touch gold
                        foil visiting cards, we inspect every file prior to production to guarantee the finest results.
                    </p>
                </div>

                <div className="rounded-3xl bg-rose-50 p-8 border border-rose-200 text-center space-y-4">
                    <h3 className="text-xl font-extrabold text-neutral-900">Have a Custom Project in Mind?</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
                        Need bulk printing, special dimensions, or bespoke finishes? Our studio print specialists are
                        here to help.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold text-white hover:bg-rose-600 transition"
                    >
                        Get in Touch with Our Studio
                    </Link>
                </div>
            </div>
        </StoreLayout>
    );
}
