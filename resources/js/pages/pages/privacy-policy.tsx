import StoreLayout from '@/layouts/store-layout';

export default function PrivacyPolicyPage() {
    return (
        <StoreLayout
            title="Privacy Policy"
            description="Privacy Policy and data security measures for PRINTWITHDWARKESH."
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-6">
                    Privacy Policy
                </h1>
                <p className="text-xs text-neutral-500 mb-8">Last Updated: October 2026</p>

                <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Information We Collect</h2>
                        <p>
                            When you place an order on PRINTWITHDWARKESH, we collect necessary customer details including your
                            name, email address, contact phone number, shipping and delivery address, and any artwork, photos,
                            or graphics uploaded for custom printing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Use of Uploaded Customer Artwork</h2>
                        <p>
                            All images, photos, artwork, and design files uploaded to PRINTWITHDWARKESH remain your intellectual
                            property. We strictly use your files solely for printing and fulfilling your ordered physical goods.
                            We never sell, distribute, or publicly display your personal photos without explicit consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Data Protection & Security</h2>
                        <p>
                            We employ SSL encryption, secure servers, and strict access controls. Payment information is processed
                            securely, and no private financial credentials or raw passwords are stored on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Communication Preferences</h2>
                        <p>
                            We use your contact details to send transactional order confirmations, tracking details, and
                            delivery updates. You can manage your email notification preferences at any time in your Customer Account.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
