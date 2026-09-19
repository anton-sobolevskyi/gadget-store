# Gadget Store

Gadget Hub is a Next.js (App Router) e-commerce storefront for gadgets — smartphones, audio, wearables, laptops, tablets, and cameras. It includes:

- A public storefront: home/featured products, search, product detail pages, and cart.
- Authentication via [Auth.js](https://authjs.dev) (credentials + Google OAuth) backed by Postgres/Drizzle.
- An `/admin` section (role-gated) for product management (CRUD + image upload to Cloudflare R2) and read-only order viewing.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Drizzle ORM](https://orm.drizzle.team) + Postgres
- [Auth.js](https://authjs.dev) (NextAuth v5)
- Tailwind CSS + Radix UI primitives
- Cloudflare R2 (S3-compatible) for image storage
- Vitest (unit/integration) + Playwright (e2e)

## Getting started

### Prerequisites

- Node.js + [pnpm](https://pnpm.io)
- Docker (for the local Postgres instance)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                                                                                      | Description                                                               |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                                | Postgres connection string (matches `docker-compose.yml` by default)      |
| `AUTH_SECRET`                                                                                 | Auth.js session secret — generate with `npx auth secret`                  |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`                                                       | Optional Google OAuth credentials                                         |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_URL` | Cloudflare R2 config, used by `lib/r2.ts` for admin product image uploads |

### 3. Start Postgres

```bash
docker compose up -d
```

### 4. Run migrations and seed data

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Useful scripts

| Script                                                                     | Purpose                                         |
| -------------------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm start`                                   | Run/build/start the Next.js app                 |
| `pnpm lint` / `pnpm typecheck` / `pnpm format`                             | Code quality checks                             |
| `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio`                  | Drizzle migrations & DB browser                 |
| `pnpm db:seed`                                                             | Seed the catalog from `data/products.ts`        |
| `pnpm db:create-admin <email> <password>`                                  | Create or promote a user to `admin` (see below) |
| `pnpm test` / `pnpm test:unit` / `pnpm test:integration` / `pnpm test:e2e` | Test suites                                     |

## Admin access

There's no sign-up flow or role-management UI. To access `/admin` locally:

```bash
pnpm db:create-admin admin@example.com Admin1234
```

This creates (or promotes) a user with that email/password and `role = "admin"`, hashing the password with bcrypt. Then sign in at [http://localhost:3000/login](http://localhost:3000/login) with those credentials and visit `/admin/products` or `/admin/orders`.

A local dev admin account already exists with:

- **Email:** `admin@example.com`
- **Password:** `Admin1234`

Change the password anytime by re-running `pnpm db:create-admin` with the same email and a new password. Do not reuse these credentials outside local development.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
