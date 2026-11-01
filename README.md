# PRINTWITHDWARKESH

**PRINTWITHDWARKESH** is a custom printing & personalized merchandise e-commerce platform built on Laravel, Inertia.js, React 19, TypeScript, and Tailwind CSS.

---

## 🌟 Core Features

- **Storefront & Catalog**:
  - Responsive visual product discovery across all devices (Mobile 375px up to 1440px desktop).
  - 14 customized product categories: Posters, Photo Prints, Mugs, Bottles, T-Shirts, Visiting Cards, Business Cards, Invitations, Photo Frames, Keychains, Custom Gifts, Stickers, Banners, Custom Printing.
  - Generic product option architecture (size, color, paper finish, print side, quantity tiers).
  - Dynamic server-side price recalculation based on selected variations.
- **Custom Artwork / Design Uploads**:
  - Client-side & server-side validation (MIME types, JPG, PNG, WEBP, PDF up to 25MB).
  - Secure storage with Laravel disk abstractions and automated association with cart & order items.
- **Cart & Server-Side Discounts**:
  - Configuration hash deduplication (merging identical option/upload bundles).
  - Coupon validation: fixed and percentage discounts, min order, expiry checks.
  - Tamper-proof calculations for subtotals, shipping, and grand totals.
- **Checkout & Order Management**:
  - Transactional order creation with human-friendly order IDs (`PWD-YYYYMMDD-XXXX`).
  - COD / Manual payment support with verified transaction flow.
- **Customer Account Portal**:
  - Account Dashboard with order history, active addresses, wishlist, and profile management.
  - Step-by-step order detail view with an audit status timeline.
  - Notification preference management.
- **Admin Portal**:
  - Order dashboard with revenue metrics and pending order counters.
  - Comprehensive order fulfillment manager (Status updates, Payment states, Courier tracking details).
  - Direct download links for customer-uploaded design files.
- **Email Notifications via EmailJS**:
  - Direct integration via official `@emailjs/browser` SDK.
  - Full fallback protection (order placement will not fail if EmailJS credentials are not yet configured).
  - Audit logging of notification attempts (`order_notification_records`).

---

## 🛠️ Stack & Technologies

- **Backend**: Laravel 12+, PHP 8.2+, Eloquent ORM, SQLite / MySQL.
- **Frontend**: React 19, TypeScript, Inertia.js v3, Tailwind CSS 4.
- **Icons & UI**: Lucide React, Sonner (Toasts), Radix UI.
- **Bundler**: Vite 8 with `@rolldown/plugin-babel`.

---

## 🚀 Getting Started

### 1. Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 20+ & npm

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
php artisan key:generate
```

Set up EmailJS credentials in `.env`:
```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```
*(Refer to `docs/EMAILJS_SETUP.md` for a 10-step template setup guide).*

### 3. Database Migration & Seed
Run migrations and the idempotent StoreSeeder:
```bash
php artisan migrate
php artisan db:seed
```

Default credentials seeded:
- **Admin**: `admin@printwithdwarkesh.com` / `password`
- **Customer**: `customer@example.com` / `password`

### 4. Compiling Assets & Running Development Servers
In separate terminal windows:
```bash
# Terminal 1: Laravel backend
php artisan serve

# Terminal 2: Vite dev server
npm run dev
```

For production builds:
```bash
npm run build
```

---

## 🛡️ Security Highlights
- Strict server-side verification: frontend prices, totals, and discounts are never trusted.
- Authorization barriers: customers can only view their own orders; admin routes require the `admin` role.
- Secure upload validation ensures only permitted file formats are accepted.

