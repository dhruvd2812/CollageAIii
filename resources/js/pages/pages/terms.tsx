import StoreLayout from '@/layouts/store-layout';

export default function TermsPage() {
    return (
        <StoreLayout
            title="Terms & Conditions"
            description="Terms and Conditions for using PRINTWITHDWARKESH."
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-6">
                    Terms &amp; Conditions
                </h1>
                <p className="text-xs text-neutral-500 mb-8">Last Updated: October 2026</p>

                <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or placing an order on PRINTWITHDWARKESH, you agree to be bound by these Terms
                            and Conditions. If you do not agree with any part of these terms, please do not use our
                            website or services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Account Registration</h2>
                        <p>
                            You may need to create an account to place orders. You are responsible for maintaining the
                            confidentiality of your account credentials and for all activities that occur under your
                            account. Please notify us immediately of any unauthorized use.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Orders &amp; Payments</h2>
                        <p>
                            All orders placed on PRINTWITHDWARKESH are subject to product availability and confirmation
                            of the order price. We reserve the right to refuse or cancel any order for any reason,
                            including errors in product or pricing information.
                        </p>
                        <p>
                            Prices displayed are in Indian Rupees (₹). Final pricing is calculated server-side at
                            the time of order placement and may include applicable shipping charges.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Custom Printing &amp; Uploaded Content</h2>
                        <p>
                            When uploading images, artwork, or design files for custom printing, you confirm that you
                            own or have the right to use the uploaded content. PRINTWITHDWARKESH is not liable for any
                            copyright infringement resulting from content you upload.
                        </p>
                        <p>
                            Custom printed products are made to order. Please review your design files carefully before
                            placing an order, as custom items may not be eligible for return or exchange due to
                            their personalised nature.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">5. Intellectual Property</h2>
                        <p>
                            All content on the PRINTWITHDWARKESH website, including but not limited to text, graphics,
                            logos, and software, is the property of PRINTWITHDWARKESH or its content suppliers and is
                            protected by applicable intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">6. Limitation of Liability</h2>
                        <p>
                            PRINTWITHDWARKESH shall not be liable for any indirect, incidental, special, or
                            consequential damages arising out of or in connection with the use of our website or
                            products, except where required by applicable law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">7. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of India. Any
                            disputes arising from these terms shall be subject to the exclusive jurisdiction of the
                            courts in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">8. Changes to Terms</h2>
                        <p>
                            PRINTWITHDWARKESH reserves the right to update these Terms and Conditions at any time. Changes
                            will be effective immediately upon posting on this page. Continued use of the website after
                            changes constitutes acceptance of the revised terms.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
