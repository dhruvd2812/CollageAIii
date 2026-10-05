import StoreLayout from '@/layouts/store-layout';

export default function RefundPolicyPage() {
    return (
        <StoreLayout
            title="Refund & Cancellation Policy"
            description="Refund and cancellation policy for PRINTWITHDWARKESH orders."
        >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mb-6">
                    Refund &amp; Cancellation Policy
                </h1>
                <p className="text-xs text-neutral-500 mb-8">Last Updated: October 2026</p>

                <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Cancellation Policy</h2>
                        <p>
                            Orders may be cancelled before they enter the production or printing stage. Once an order
                            has moved to "Processing" or "Printing" status, it cannot be cancelled as production has
                            already begun. To request a cancellation, please contact us immediately through the Contact
                            page with your order number.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Return Eligibility</h2>
                        <p>
                            Products may be eligible for return if they arrive with manufacturing defects, printing
                            errors (not matching the uploaded design), or physical damage during transit. Returns must
                            be requested within a reasonable period after delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Non-Returnable Items</h2>
                        <p>
                            Due to the personalised nature of our products, the following are generally
                            <strong> not eligible</strong> for return or exchange:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Custom printed products made with your uploaded design or photo</li>
                            <li>Personalised gifts and items created to your specifications</li>
                            <li>Products with no manufacturing or printing defect</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Refund Process</h2>
                        <p>
                            If your return is approved, the refund will be processed using the original payment method
                            where possible. For Cash on Delivery orders, refunds may be processed via bank transfer
                            or other available methods.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">5. Refund Timeline</h2>
                        <p>
                            Approved refunds are typically processed within a few business days. The actual credit to
                            your account may take additional time depending on your bank or payment provider.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">6. Damaged or Defective Items</h2>
                        <p>
                            If you receive a damaged or defective product, please contact us through the Contact page
                            with your order number and photos of the issue. We will review the case and offer a
                            replacement or refund as appropriate.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-neutral-900 mb-2">7. Contact for Support</h2>
                        <p>
                            For any questions regarding cancellations, returns, or refunds, please reach out to us via
                            the Contact page on our website. Include your order number for faster assistance.
                        </p>
                    </section>
                </div>
            </div>
        </StoreLayout>
    );
}
