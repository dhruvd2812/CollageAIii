# Database Schema

## Conventions

The production target is MySQL 8+ or MariaDB 10.6+. Laravel migrations remain
compatible with SQLite where the framework supports the corresponding feature.
All monetary values are stored as integer minor units: for INR, `10000` means
₹100.00. Percentage discounts use basis points, so `1250` means 12.50%.

Status, type and provider fields use strings rather than database enums. Their
allowed values are enforced by the domain layer in later steps; this keeps the
schema portable and makes future status additions safe.

## Identity and communication

- `users` is Laravel's authentication record, extended with an optional phone.
- `roles` and `role_user` provide reusable roles; no administrator account or
  role data is seeded by these migrations.
- `email_preferences` has one record per user and separates order-update
  consent from marketing consent.
- `addresses` stores saved customer delivery addresses. Orders retain their own
  address snapshots and do not depend on future address changes.

## Catalog and customization

- `categories` supports nesting through `parent_id`, active state, ordering and
  optional stored media paths.
- `products` belongs to a category and holds stock, price, publication and
  customization state. Catalog records use soft deletes.
- `product_images` supports an ordered, multi-image product gallery.
- `product_options` is a product-scoped, typed option definition. Its JSON
  configuration can represent reusable constraints for select, text, number or
  file fields without a product-type-specific schema.
- `product_option_values` supplies selectable values and their price deltas.

## Cart and uploads

- `carts` supports either a persistent authenticated customer cart or a guest
  session cart. `cart_items` identifies a configuration with a SHA-256-style
  fingerprint and keeps its server-calculated unit price.
- `design_uploads` holds metadata for generated private-storage artwork files;
  it never stores an executable payload in the database. `cart_item_uploads`
  maps one or more uploads to a configured cart item.

## Promotions and orders

- `coupons` supports fixed and percentage discounts, time windows, totals and
  per-user limits. `coupon_usages` ties a redemption to exactly one order.
- `orders` stores immutable buyer, address, payment/status and monetary
  snapshots. It can belong to a user but also supports a future guest checkout.
- `order_items` snapshots product identity and pricing. Its child
  `order_item_customizations` preserves submitted customization labels, values
  and price effects even if catalog options later change.
- `order_item_uploads` copies file metadata needed to securely serve artwork
  from an order, while optionally retaining a link to its source upload.
- `order_status_histories` is the order-tracking timeline. `payments` supports
  multiple payment attempts and provider references for later gateway work.

## Trust and notification records

- `reviews` is tied to a specific purchased order item, preventing a customer
  from reviewing an unpurchased product.
- `order_notification_records` records queued/sent/failed order messages
  without storing EmailJS or payment credentials.
