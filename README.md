 
 
-## Getting Started
+A production-style ecommerce foundation built with **Next.js App Router** + **Supabase**.
 
-First, run the development server:
+## Stack
+
+- **Frontend:** Next.js 16 + React 19 + Tailwind CSS 4
+- **Backend/BFF:** Next.js Route Handlers (`app/api/*`)
+- **Database/Auth:** Supabase
+- **Validation:** Zod
+
+## Quick start
+
+1. Install dependencies:
 
 ```bash
-npm run dev
-# or
-yarn dev
-# or
-pnpm dev
-# or
-bun dev
+npm install
 ```
 
-Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
+2. Create a `.env.local` file in the project root and add your Supabase values:
+
+- `NEXT_PUBLIC_SUPABASE_URL`
+- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 
-You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
+3. Run the app:
 
-This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
+```bash
+npm run dev
+```
+
+## Initial architecture
+
+```text
+app/
+  api/
+    health/route.ts          # Service health endpoint
+    products/route.ts        # Product listing endpoint (validated query params)
+  layout.tsx                 # Root layout + metadata
+  page.tsx                   # Server-rendered storefront
+lib/
+  config/env.ts              # Runtime environment checks
+  repositories/products.ts   # Data access layer for product queries
+  supabase/server.ts         # Server-side Supabase client factory
+  types/database.ts          # Database types
+  validators/product-query.ts# Zod schemas for API input
+```
 
-## Learn More
+## Product table expectation
 
-To learn more about Next.js, take a look at the following resources:
+The starter currently expects a `public.products` table with fields:
 
-- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
+- `id` (uuid/text)
+- `name` (text)
+- `description` (text nullable)
+- `image_url` (text nullable)
+- `price_cents` (integer)
+- `currency` (text, e.g. `USD`)
+- `active` (boolean)
+- `created_at` (timestamp)
 
-You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
+## Endpoints
 
-## Deploy on Vercel
+- `GET /api/health`
+- `GET /api/products?limit=20&active=true&search=shoe`
 
-The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
+## Next production steps
 
-Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
+- Add Supabase Auth (email/password or OAuth) and protected account routes.
+- Add cart persistence (guest + authenticated merge logic).
+- Add checkout with Stripe payment intents/webhooks.
+- Add role-based admin routes for inventory and order management.
+- Add integration tests for route handlers and repository layer.



#Phase 0 — Product scope first (avoid rework)
Before touching implementation, lock these decisions:

1.Catalog model: simple products only vs variants (size/color)?

#variants
Product

id: string

name: string

description: string | null

image_url: string | null

base_price_cents: number

currency: string

active: boolean

created_at: string
ProductVariant

id: string

product_id: string (FK → products)

sku: string (optional)

name: string (e.g. “Red / Large”)

price_cents: number (can override base_price)

quantity_on_hand: number

OptionType

id: string

name: string (e.g. “Color”)

OptionValue

id: string

type_id: string (FK → OptionType)

name: string (e.g. “Red”)
ProductOptionType

product_id: string (composite PK)

option_type_id: string (composite PK)

2.Checkout model: guest checkout allowed?

#guest checkout-No

3.Payments: Stripe now or later?

#Stripe now-Test mode

4.Admin roles: single admin vs multiple roles?

#single admin

5.Regions/currencies: USD only first?

#USD only
