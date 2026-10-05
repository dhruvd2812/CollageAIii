import { Link } from '@inertiajs/react';
import { Mail, MapPin, MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import StoreLayout from '@/layouts/store-layout';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <StoreLayout
            title="Contact Us & Studio Support"
            description="Reach out to the PRINTWITHDWARKESH custom printing team for support, custom queries, and corporate orders."
        >
            <div className="bg-neutral-950 text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                    We're Here to Help
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2">
                    Contact PRINTWITHDWARKESH
                </h1>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mt-3">
                    Have questions regarding your custom print specifications, bulk corporate orders, or design files?
                    Reach out to our dedicated print specialists.
                </p>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
                            <h2 className="font-extrabold text-lg text-neutral-950">Studio Information</h2>

                            <div className="space-y-4 text-xs sm:text-sm text-neutral-600">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shrink-0">
                                        <Mail className="size-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900">Email Inquiries</p>
                                        <a href="mailto:hello@printwithdwarkesh.com" className="text-rose-600 hover:underline">
                                            hello@printwithdwarkesh.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                                        <Phone className="size-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900">WhatsApp & Phone Support</p>
                                        <a href="tel:+919876543210" className="text-neutral-700">
                                            +91 98765 43210
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                                        <MapPin className="size-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900">Studio & Workshop</p>
                                        <p className="text-neutral-600">Printworks Hub, Gujarat, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
                                <p className="font-bold text-neutral-800">Support Operating Hours:</p>
                                <p>Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                                <p>Sunday: Closed (Inquiries handled on Monday morning)</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Message Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200 shadow-xs">
                            <h2 className="font-extrabold text-lg text-neutral-950 mb-6">Send Us a Message</h2>

                            {sent ? (
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                                    <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                        <MessageSquare className="size-6" />
                                    </div>
                                    <h3 className="font-extrabold text-neutral-900 text-base">Message Sent Successfully!</h3>
                                    <p className="text-xs text-neutral-600">
                                        Thank you for contacting PRINTWITHDWARKESH. Our team will get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSent(false)}
                                        className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                                    >
                                        Send Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-700 mb-1">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Aarav Patel"
                                                className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+91 98765 43210"
                                                className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="aarav@example.com"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Subject / Inquiry Type *</label>
                                        <input
                                            type="text"
                                            required
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. Bulk Visiting Cards Inquiry, Custom Poster Sizing"
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Message Details *</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Describe your design specifications, dimensions, quantity, or question..."
                                            className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-900 focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3 text-xs font-bold text-white hover:bg-rose-600 transition shadow-md"
                                    >
                                        <Send className="size-3.5" />
                                        <span>Submit Message</span>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
