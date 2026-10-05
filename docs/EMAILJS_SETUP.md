# EmailJS Setup Guide for PRINTWITHDWARKESH

This guide explains how to configure EmailJS so that the store owner instantly receives email notifications whenever a customer places an order on **PRINTWITHDWARKESH**.

---

## Overview

We use the official `@emailjs/browser` SDK to deliver real-time order notifications securely:
- **Public Key**: Client-side safe identifier used by the browser to authorize template dispatches.
- **Service ID**: Connects your email provider (e.g. Gmail, Outlook, Custom SMTP).
- **Template ID**: Formats the order variables into a professional HTML/Text receipt for the business owner.
- **Backend Logging**: Notification statuses (`pending`, `sent`, `failed`) and provider message IDs are automatically recorded in the database `order_notification_records` table.

---

## Step-by-Step Setup

### 1. Create an EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/) and create a free account.
2. Verify your email address and log in to the EmailJS dashboard.

### 2. Add an Email Service
1. In the EmailJS dashboard, navigate to **Email Services** → **Add New Service**.
2. Select your preferred email provider (e.g., **Gmail**, **Outlook**, or **Custom SMTP**).
3. Connect your store email account (e.g. `owner@printwithdwarkesh.com` or your business Gmail).
4. Note your **Service ID** (e.g. `service_abc123`).

### 3. Create the Order Notification Template
1. Navigate to **Email Templates** → **Create New Template**.
2. Set the **Subject** line to:
   ```text
   New Order - {{order_number}}
   ```
3. Set the **Content / Body** to:
   ```text
   New order received on PRINTWITHDWARKESH!

   Order Number: {{order_number}}
   Order Date: {{order_date}}

   Customer Details:
   Name: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}

   Products Ordered:
   {{product_list}}

   Customization & Options:
   {{customization_details}}

   Shipping Address:
   {{shipping_address}}

   Financial Breakdown:
   Subtotal: {{subtotal}}
   Discount: {{discount}}
   Shipping: {{shipping}}
   Total Amount: {{total}}

   Payment Method: {{payment_method}}
   Payment Status: {{payment_status}}
   Order Status: {{order_status}}
   ```
4. Set **To Email** to `{{to_email}}` or your personal business email.
5. Click **Save** and note your **Template ID** (e.g. `template_xyz789`).

### 4. Obtain Your Public Key
1. Go to **Account** → **General** in the EmailJS dashboard.
2. Find your **Public Key** (e.g. `user_abcdef123456`).

---

## 5. Configure Your Environment Variables

Add the following placeholders to your `.env` file (never commit your secret values to version control):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

---

## 6. Restart Vite Development Server

After updating `.env`, restart the Vite development server so the environment variables are loaded:

```bash
npm run dev
# or for production build
npm run build
```

---

## 7. Test an Order

1. Open the storefront at `http://127.0.0.1:8000/shop`.
2. Add any custom print product to your bag (upload a photo/design if applicable).
3. Proceed to Checkout and place an order using Cash on Delivery.
4. On the **Order Success** page (`/order-success/PWD-XXXXX-XXXX`), EmailJS will dispatch the notification email in the background.
5. Check your business owner inbox for the incoming order alert!
6. Verify in the Admin Dashboard (`/admin/orders`) that the notification status displays `sent`.
