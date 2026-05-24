# AGENTS.md — La Vie Naturelle Ecommerce

## Stack & Package Manager
- **Next.js 16** + **React 19** (App Router)
- **pnpm** workspace (`pnpm-workspace.yaml` exists)
- **Supabase** with `@supabase/ssr` (v0.10.2)
- **Tailwind CSS v4** + **shadcn/ui** (New York style, icons: `lucide-react`)
- No test suite or test runner configured

## Dev Commands
```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # ESLint only (no typecheck script)
```

## Critical: middleware is deprecated
**`the "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy Unhandled Rejection: Error: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected. Please use "./proxy.ts" only. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy'**.


## Supabase Client Pattern
There are two clients. Do NOT mix them up:
- **Browser**: `lib/supabase/client.ts` — `createBrowserClient`, for reads in Client Components.
- **Server**: `lib/supabase/server.ts` — `createServerClient` with cookie access, for Server Components and Server Actions.

**Writes from checkout must use Server Actions** (e.g. `app/checkout/actions.ts`) with the server client. Do NOT use the browser client for `orders` or `order_items` inserts — it fails with 401 even when RLS allows anonymous inserts, because the browser client session can be stale without middleware.

## Database & Migrations
- Types: `lib/supabase/types/database.ts` (hand-maintained, not generated).
- Migrations: `lib/supabase/migrations/` — SQL files define tables, RLS, triggers, and role sync.
- Key tables: `profiles`, `addresses`, `orders`, `order_items`, `products`, `product_reviews`, `product_multimedia`.
- RLS: `orders` and `order_items` allow anonymous inserts (`WITH CHECK (true)`). Other tables require auth.
- Role check: `is_admin()` and `get_my_role()` rely on `auth.jwt() -> 'app_metadata' ->> 'role'`.

## App Router Structure
- `app/page.tsx` — Home / catalog.
- `app/producto/[slug]/page.tsx` — Product detail.
- `app/categoria/[slug]/page.tsx` — Category filter.
- `app/checkout/page.tsx` — Checkout flow (Client Component) calling Server Actions.
- `app/account/` — User dashboard.
- `app/admin/` — Admin panel (orders, products, etc.).
- `app/login/`, `app/register/`, `app/auth/` — Auth flows.

## State & Cart
- Cart state lives in `lib/cart-context.tsx` (React Context + `localStorage`).
- No global state library like Zustand or Redux.

## Styling
- Tailwind v4 config is inline in `app/globals.css` via `@theme inline`.
- Theme uses a custom sage-green palette (not default neutral/slate).
- Font variables: `--font-serif` (Playfair Display), `--font-sans` (Montserrat).

## Images
- `next.config.mjs` sets `images.unoptimized: true`. Do not assume `next/image` optimization is on but we have to use Image from next first.

## Lint / Typecheck
- ESLint config is default Next.js. No separate `tsc --noEmit` script exists.
- `tsconfig.json` targets ES6, moduleResolution `bundler`, strict mode on.

## Env Variables
Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```
There is no `SUPABASE_SERVICE_ROLE_KEY` in the repo currently.
