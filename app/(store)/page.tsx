import { isSupabaseConfigured } from "@/lib/config/env";
import { listProducts } from "@/lib/repositories/products";

function toCurrency(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export default async function Home() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">NovaCart</h1>
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
          your environment to load products.
        </p>
      </main>
    );
  }

  const products = await listProducts({ limit: 12, active: true });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Production Starter</p>
        <h1 className="text-4xl font-semibold">NovaCart</h1>
        <p className="max-w-2xl text-slate-600">
          A production-focused ecommerce foundation using Next.js App Router, Supabase, and typed data access.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{product.currency}</p>
            <h2 className="mt-1 text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{product.description ?? "No description yet."}</p>
            <p className="mt-4 text-xl font-semibold">{toCurrency(product.price_cents, product.currency)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}