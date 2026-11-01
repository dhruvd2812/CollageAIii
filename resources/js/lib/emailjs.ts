import emailjs from '@emailjs/browser';

export interface OrderEmailPayload {
    order_id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    product_list: string;
    customization_details: string;
    shipping_address: string;
    subtotal: string;
    discount: string;
    shipping: string;
    total: string;
    payment_status: string;
    payment_method?: string;
    order_status: string;
    order_date: string;
    subject?: string;
    notification_type?: string;
}

export interface SendEmailResult {
    success: boolean;
    providerMessageId?: string;
    error?: string;
    notConfigured?: boolean;
}

/**
 * Send order notification email to business owner using official EmailJS Browser SDK
 */
export async function sendOrderNotificationEmail(payload: OrderEmailPayload): Promise<SendEmailResult> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check if EmailJS keys are configured
    if (!serviceId || !templateId || !publicKey) {
        const warningMsg =
            'EmailJS is not fully configured in your environment. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env. See docs/EMAILJS_SETUP.md for instructions.';
        console.warn('[PRINTWITHDWARKESH EmailJS Notice]:', warningMsg);

        // Record notification attempt as pending/not configured in backend without crashing
        await recordNotificationStatus(payload.order_id, 'failed', undefined, 'EmailJS keys not configured in .env', payload.notification_type);

        return {
            success: false,
            notConfigured: true,
            error: warningMsg,
        };
    }

    try {
        const templateParams = {
            order_number: payload.order_number,
            customer_name: payload.customer_name,
            customer_email: payload.customer_email,
            customer_phone: payload.customer_phone,
            product_list: payload.product_list,
            customization_details: payload.customization_details,
            shipping_address: payload.shipping_address,
            subtotal: payload.subtotal,
            discount: payload.discount,
            shipping: payload.shipping,
            total: payload.total,
            payment_status: payload.payment_status,
            payment_method: payload.payment_method || 'Cash on Delivery',
            order_status: payload.order_status,
            order_date: payload.order_date,
            to_email: import.meta.env.VITE_EMAILJS_OWNER_EMAIL || '',
            subject: payload.subject || `New Order - ${payload.order_number}`,
        };

        const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

        const providerId = response.text || `status-${response.status}`;

        // Record successful notification in backend
        await recordNotificationStatus(payload.order_id, 'sent', providerId, undefined, payload.notification_type);

        return {
            success: true,
            providerMessageId: providerId,
        };
    } catch (err: any) {
        const errorMsg = err?.text || err?.message || 'Failed to send EmailJS order email.';
        console.error('[EmailJS Send Error]:', errorMsg);

        // Record failure in backend
        await recordNotificationStatus(payload.order_id, 'failed', undefined, errorMsg, payload.notification_type);

        return {
            success: false,
            error: errorMsg,
        };
    }
}

/**
 * Report notification status back to Laravel database backend
 */
async function recordNotificationStatus(
    orderId: number,
    status: 'sent' | 'failed',
    providerMessageId?: string,
    errorMessage?: string,
    notificationType?: string
): Promise<void> {
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        await fetch('/api/order-notifications/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
            },
            body: JSON.stringify({
                order_id: orderId,
                status: status,
                provider_message_id: providerMessageId,
                error_message: errorMessage,
                notification_type: notificationType || 'owner_order_alert',
            }),
        });
    } catch (e) {
        console.warn('Could not record notification status to backend database:', e);
    }
}
