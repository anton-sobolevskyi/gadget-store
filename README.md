# Gadget Hub

Gadget Hub is a production-minded Next.js storefront for smartphones, audio, wearables, laptops, tablets, and cameras. The portfolio focus is a shareable product catalog: server-rendered filters, URL state, pagination, responsive product cards, and an accessible product gallery.

## Features

- Catalog filtering by search, category, price range, stock status, and sort order.
- Shareable catalog URLs with active filters, clear-all, result counts, empty states, loading states, and pagination.
- Product details with breadcrumbs, thumbnails, keyboard and touch gallery navigation, lightbox viewing, related products, quantity controls, cart, and wishlist.
- Auth.js credentials and Google OAuth backed by Postgres and Drizzle ORM.
- Role-gated admin product CRUD with Cloudflare R2 image uploads and read-only order management.
- Metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD product data, sitemap, and robots rules.
- Unit, integration, and Playwright end-to-end tests with CI checks.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4, Radix UI primitives, Lucide icons
- Drizzle ORM, PostgreSQL, Auth.js
- Cloudflare R2 for admin-uploaded images
- Vitest, Testing Library, Testcontainers, Playwright

## Local setup

### Prerequisites

- Node.js 20 or newer
- pnpm
- Docker for local PostgreSQL

### Install and configure

```bash
pnpm install
cp .env.example .env
```

Required environment variables:

| Variable                                                                                      | Purpose                                             |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL`                                                                                | PostgreSQL connection string                        |
| `AUTH_SECRET`                                                                                 | Auth.js session secret                              |
| `NEXT_PUBLIC_SITE_URL`                                                                        | Public origin used by metadata, sitemap, and robots |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`                                                       | Optional Google OAuth credentials                   |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_URL` | Optional Cloudflare R2 image storage                |

Start the database and seed the catalog:

```bash
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command                    | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `pnpm dev`                 | Start the development server                         |
| `pnpm build && pnpm start` | Build and run production mode                        |
| `pnpm lint`                | Run ESLint                                           |
| `pnpm typecheck`           | Run TypeScript without emitting files                |
| `pnpm test:unit`           | Run unit and component tests                         |
| `pnpm test:integration`    | Run PostgreSQL integration tests with Testcontainers |
| `pnpm test:e2e`            | Run Playwright browser tests                         |
| `pnpm format:check`        | Check Prettier formatting                            |

## Catalog URL contract

The canonical catalog is `/products`. Supported query parameters are:

`q`, `category`, `minPrice`, `maxPrice`, `inStock=true`, `sort=price-asc|price-desc|rating-desc`, and `page`.

Category routes reuse the same filtering behavior while constraining results to one category. Search pages remain noindex because they are user-generated result pages.

## Admin access

There is no public sign-up or role-management UI. Create a local administrator with:

```bash
pnpm db:create-admin admin@example.com <password>
```

Then sign in at `/login` and open `/admin/products` or `/admin/orders`. Never reuse development credentials in a deployed environment.

## Deployment notes

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin, run migrations during deployment, and configure the database, Auth.js, and R2 environment variables. Product seed data is demo content; production catalogs should use the admin workflow or a managed import.

The demo currently uses external Unsplash image URLs for seeded products and is English-only. A production rollout should move catalog media to R2 or another controlled image origin and add localized routes before emitting hreflang alternates.
