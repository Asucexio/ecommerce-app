"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";

interface Product {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  currency: string;
  description: string | null;
  active: boolean;
}

const heroSlides = [
  { title: "Fresh Groceries, Delivered Daily", subtitle: "Get up to 30% off on your first $150 purchase", emoji: "🥒", bg: "from-gray-900 via-green-950 to-gray-900" },
  { title: "Farm Fresh Quality Guaranteed", subtitle: "Free shipping on orders over $50", emoji: "🥕", bg: "from-gray-900 via-gray-800 to-green-950" },
  { title: "Premium Produce Every Day", subtitle: "Shop thousands of products at great prices", emoji: "🥬", bg: "from-green-950 via-gray-900 to-gray-900" },
];

function ProductCard({ product, cartId, onAdded }: { product: Product; cartId: string | null; onAdded: (id: string) => void }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (!cartId) return;
    setAdding(true);
    try {
      await addItem({ cartId, productId: product.id, quantity: qty });
      setAdded(true);
      onAdded(product.id);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error("Failed to add item:", err);
    } finally {
      setAdding(false);
    }
  }

  const discounted = product.price_cents * 0.75;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-green-300 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <div className="absolute top-2 left-2 z-10 rounded-md bg-yellow-400 px-2 py-0.5 text-xs font-bold text-gray-900">25% Off</div>
        <div className="flex h-full items-center justify-center">
          <svg className="h-20 w-20 text-gray-200 transition-transform group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mb-2 text-xs text-gray-500">500g Pack</p>
        <div className="mb-3 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-red-600">${(discounted / 100).toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${(product.price_cents / 100).toFixed(2)}</span>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-8 w-7 items-center justify-center text-gray-500 hover:text-green-600">−</button>
            <span className="w-6 text-center text-sm font-medium">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="flex h-8 w-7 items-center justify-center text-gray-500 hover:text-green-600">+</button>
          </div>
          <button
            onClick={() => void handleAdd()}
            disabled={adding || !cartId}
            className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition-all ${added ? "bg-green-600 text-white" : "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"} disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            {added ? "✓ Added" : adding ? "…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog/products?limit=12&active=true");
      const json = (await res.json().catch(() => null)) as { data?: { items?: Product[] } } | null;
      setProducts(json?.data?.items ?? []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  }, []);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const featured = products.slice(0, 4);
  const bestSellers = products.slice(0, 12);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Slider ─────────────────────────────────────────────── */}
      <section className="relative h-96 overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-r ${slide.bg} transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <div className="text-center text-white px-4">
              <div className="mb-5 text-7xl">{slide.emoji}</div>
              <h1 className="mb-3 text-4xl font-bold leading-tight">{slide.title}</h1>
              <p className="mb-7 text-lg text-gray-300">{slide.subtitle}</p>
              <Link href="/products" className="inline-block rounded-lg bg-green-600 px-8 py-3 font-bold text-white hover:bg-green-500 transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
        ))}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all ${i === currentSlide ? "bg-white w-7" : "bg-white/40 w-2.5 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </section>

      {/* ── Value Props ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: "🚚", title: "Free Delivery", sub: "On orders over $50" },
            { icon: "🌿", title: "Fresh Produce", sub: "Sourced daily" },
            { icon: "↩️", title: "Easy Returns", sub: "7-day return policy" },
            { icon: "🔒", title: "Secure Payment", sub: "Powered by Stripe" },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured with Promos ────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Products With Discounts</h2>
            <Link href="/products" className="text-sm font-medium text-green-600 hover:underline">View all →</Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Promo banners */}
            <div className="flex flex-col gap-4">
              <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 p-6 text-white">
                <div className="absolute -right-6 -top-6 text-8xl opacity-20 select-none">🎉</div>
                <h3 className="relative text-xl font-bold">Special Offer</h3>
                <p className="relative mt-1 text-sm">30% Off Selected Items</p>
                <Link href="/products" className="relative mt-4 inline-block rounded-lg bg-white px-5 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors">
                  Shop Now
                </Link>
              </div>
              <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-6 text-white">
                <div className="absolute -right-6 -bottom-6 text-8xl opacity-20 select-none">🌿</div>
                <h3 className="relative text-xl font-bold">Farm Fresh</h3>
                <p className="relative mt-1 text-sm">Quality Guaranteed Daily</p>
                <Link href="/products" className="relative mt-4 inline-block rounded-lg bg-white px-5 py-2 text-sm font-bold text-green-700 hover:bg-green-50 transition-colors">
                  Explore
                </Link>
              </div>
            </div>

            {/* Featured grid */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {featured.length > 0
                ? featured.map(p => (
                  <ProductCard key={p.id} product={p} cartId={cart?.id ?? null} onAdded={() => { }} />
                ))
                : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-100" />
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Cards ──────────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {[
              { name: "Dairy", icon: "🥛" },
              { name: "Meats", icon: "🍗" },
              { name: "Bakery", icon: "🍞" },
              { name: "Snacks", icon: "🍿" },
              { name: "Health", icon: "💊" },
              { name: "Frozen", icon: "❄️" },
              { name: "Staples", icon: "🥫" },
              { name: "More", icon: "📦" },
            ].map(({ name, icon }) => (
              <Link
                key={name}
                href={`/products?category=${name}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-4 text-center transition-all hover:border-green-300 hover:shadow-md"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-semibold text-gray-700">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ─────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Best Selling Products</h2>
            <Link href="/products" className="text-sm font-medium text-green-600 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {bestSellers.length > 0
              ? bestSellers.map(p => (
                <ProductCard key={p.id} product={p} cartId={cart?.id ?? null} onAdded={() => { }} />
              ))
              : Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-gray-100" />
              ))
            }
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="mx-4 mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-green-500 px-8 py-12 text-center text-white">
        <h2 className="mb-2 text-3xl font-bold">Get 30% off your first order</h2>
        <p className="mb-6 text-green-100">Use code NOVA30 at checkout. Valid for new customers only.</p>
        <Link href="/products" className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-green-700 hover:bg-green-50 transition-colors">
          Start Shopping
        </Link>
      </section>

      <Footer />
    </main>
  );
}
