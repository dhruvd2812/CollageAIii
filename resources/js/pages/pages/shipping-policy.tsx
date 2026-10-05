import StoreLayout from '@/layouts/store-layout';

export default function ShippingPolicyPage() {
    return (
        <StoreLayout
            title="Shipping Policy"
            description="Shipping information and delivery details for PRINTWITHDWARKESH."
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-6">
                    Shipping Policy
                </h1>
                <p className="text-xs text-neutral-500 mb-8">Last Updated: October 2026</p>

                <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Processing Time</h2>
                        <p>
                            Custom printed products require production time. Orders are typically processed and prepared
                            for dispatch after confirmation and design approval. Processing times vary depending on the
                            product type and current order volume.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Shipping Methods</h2>
                        <p>
                            PRINTWITHDWARKESH ships orders using reliable courier and postal services within India.
                            The shipping method is selected based on the delivery location, package size, and product type.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Delivery Estimates</h2>
                        <p>
                            Delivery timelines depend on your location and the product ordered. Standard delivery
                            typically takes a few business days after dispatch. Custom or made-to-order products may
                            require additional processing time before shipping.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Shipping Charges</h2>
                        <p>
                            Shipping charges are calculated at checkout based on the delivery address and order weight.
                            Orders above <strong>₹799</strong> may qualify for free standard shipping within India,
                            subject to applicable conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">5. Order Tracking</h2>
                        <p>
                            Once your order has been dispatched, tracking information will be updated in your account
                            under Order History, if a tracking number is provided by the courier partner.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">6. Damaged or Lost Shipments</h2>
                        <p>
                            If your order arrives damaged or does not arrive within a reasonable timeframe after dispatch,
                            please contact us through the Contact page with your order number so we can investigate and
                            resolve the issue.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">7. Important Notes</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Delivery timelines are estimates and not guaranteed.</li>
                            <li>Public holidays and unforeseen circumstances may cause delays.</li>
                            <li>Please ensure your shipping address and contact number are accurate at checkout.</li>
                            <li>PRINTWITHDWARKESH is not responsible for delays caused by courier partners or incorrect address details.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
