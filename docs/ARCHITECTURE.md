# Custom Printing Store Architecture

## Platform

The application uses Laravel 13, PHP 8.3+, Eloquent, Fortify authentication,
Inertia and the repository's existing React/TypeScript frontend. The React
starter is retained as the established application stack; all business rules,
pricing, validation, authorization and persistence remain server-side in
Laravel.

The production database target is MySQL 8+/MariaDB 10.6+. SQLite remains
compatible for isolated local tests where practical.

## Application boundaries

| Area | Laravel responsibility | Frontend responsibility |
| --- | --- | --- |
| Storefront | Product discovery, search/filter query scopes, pricing data | Responsive catalog, product detail and customization forms |
| Identity | Fortify authentication, roles and authorization policies | Login, registration, profile and account screens |
| Commerce | Cart merge rules, server-calculated totals, coupons and checkout transaction | Cart and checkout interactions |
| Orders | Order snapshots, status transitions, stock changes and notifications | Customer tracking and admin order views |
| Administration | Admin middleware, CRUD controllers, request validation and policies | Admin dashboard and management screens |
| Integrations | Payment contracts, queued notifications and configuration | Only browser-safe EmailJS public configuration when enabled |

## Planned modules

`app/Domain` will contain focused modules rather than a large generic service
layer:

- `Catalog`: categories, products, media, product options and values.
- `Customization`: reusable typed option definitions, uploads and price
  adjustments.
- `Cart`: guest-session carts and authenticated persistent carts.
- `Checkout`: address selection, coupon validation and atomic order placement.
- `Orders`: order status transitions, stock reservation/decrement and timeline.
- `Payments`: a payment gateway contract with Cash on Delivery as the initial
  safe implementation.
- `Notifications`: queued order event listeners and notification channels.
- `Administration`: role-protected controllers and reporting queries.

HTTP controllers stay thin. Form requests validate input, policies and
middleware authorize it, action classes execute state-changing workflows, and
Eloquent models own relationships/query scopes. Database events are dispatched
only after successful transactions.

## Route and access plan

Public storefront routes will be named under `store.*`. Authentication comes
from Fortify. Customer account routes use `auth` and verified-email middleware;
administrative routes use `auth`, verified-email middleware and a dedicated
`admin` role middleware. State-changing routes use Laravel CSRF protection and
rate limiting where appropriate.

## Data and integrity plan

The next stage introduces normalized migrations for catalog, cart, address,
order, payment, review, coupon and notification entities. Order items preserve
product name, SKU, price and customization snapshots, so historical orders do
not change when a catalog product is edited. Money is stored as integer minor
units. Foreign keys, unique constraints and indexes will be added with each
table.

## Files, payments and notifications

Customer artwork is validated by MIME type and size, stored under a private
disk with generated names, and is authorized before download. Payment gateways
are accessed through an interface and configured exclusively through
environment variables. EmailJS identifiers are represented in `.env.example`;
private credentials are never exposed to the browser or committed.

## Delivery sequence

Work follows the requested sequence: migrations, identity, admin, catalog,
customization, cart, checkout, orders, payments, notifications, customer
account, discovery, responsive UI, hardening, tests and production cleanup.

## Source-control delivery policy

After each successfully verified step, inspect `git status`, review only that
step's changed files, ensure no credentials or generated files are staged, and
create a descriptive commit. The commit is pushed to the dedicated `CollageAI`
GitHub repository after its remote and destination have been verified. An
existing repository is never replaced, and an unrelated remote is never used.
The repository is created only once Laravel dependency installation and the
Step 1 runtime verification succeed.
