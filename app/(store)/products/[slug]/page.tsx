"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

type ProductDto = {
    id: string;
    name: string;
    slug: string;
    price_cents: number;
    description: string | null;
    currency: string;
    active: boolean;
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const { cart, addItem } = useCart();
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [addedMsg, setAddedMsg] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            try {
                const res = await fetch(`/api/catalog/products/slug/${encodeURIComponent(params.slug)}`);
                const json = (await res.json().catch(() => null)) as { data?: { product?: ProductDto } } | null;
                const p = json?.data?.product ?? null;
                if (!p) setNotFound(true);
                else setProduct(p);
            } finally {
                setLoading(false);
            }
        }
        void loadProduct();
    }, [params.slug]);

    async function onAddToCart() {
        if (!cart?.id || !product?.id) return;
        setAdding(true);
        setAddedMsg("");
        try {
            await addItem({ cartId: cart.id, productId: product.id, quantity });
            setAddedMsg("Added to cart!");
            setTimeout(() => setAddedMsg(""), 2500);
        } catch (err) {
            setAddedMsg(err instanceof Error ? err.message : "Failed to add item");
        } finally {
            setAdding(false);
        }
    }

    const discountedPrice = product ? product.price_cents * 0.75 : 0;

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="mx-auto max-w-5xl px-4 py-8">
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-green-600">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-green-600">Products</Link>
                    {product && <><span>/</span><span className="text-gray-900">{product.name}</span></>}
                </nav>

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
                    </div>
                )}

                {notFound && !loading && (
                    <div className="py-20 text-center">
                        <p className="text-xl font-medium text-gray-700">Product not found</p>
                        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-green-600 hover:underline">← Back to products</Link>
                    </div>
                )}

                {product && !loading && (
                    <div className="grid gap-10 md:grid-cols-2">
                        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                            <div className="absolute top-4 left-4 z-10 rounded-lg bg-yellow-400 px-3 py-1 text-sm font-bold text-gray-900">25% Off</div>
                            <div className="flex aspect-square items-center justify-center">
                                <svg className="h-48 w-48 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.name}</h1>

                            {product.description && (
                                <p className="mb-5 leading-relaxed text-gray-600">{product.description}</p>
                            )}

                            <div className="mb-6 flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-red-600">${(discountedPrice / 100).toFixed(2)}</span>
                                <span className="text-lg text-gray-400 line-through">${(product.price_cents / 100).toFixed(2)}</span>
                                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-600">Save 25%</span>
                            </div>

                            <div className="mb-6 grid grid-cols-2 gap-3">
                                {[
                                    { label: "Weight", value: "500g" },
                                    { label: "Currency", value: product.currency },
                                    { label: "Availability", value: product.active ? "✓ In Stock" : "Out of Stock" },
                                    { label: "Category", value: "Grocery" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
                                        <p className="text-xs font-medium text-gray-500">{label}</p>
                                        <p className="mt-0.5 text-sm font-semibold text-gray-800">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex items-center rounded-xl border-2 border-green-600">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-xl text-green-600 hover:bg-green-50 rounded-l-xl">−</button>
                                    <span className="w-10 text-center text-lg font-bold text-gray-900">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="flex h-11 w-11 items-center justify-center text-xl text-green-600 hover:bg-green-50 rounded-r-xl">+</button>
                                </div>
                                <button
                                    onClick={() => void onAddToCart()}
                                    disabled={adding || !cart?.id || !product.active}
                                    className="flex-1 rounded-xl bg-green-600 py-3 text-base font-bold text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {adding ? "Adding…" : "Add to Cart"}
                                </button>
                            </div>

                            {addedMsg && (
                                <p className={`text-sm font-medium ${addedMsg.startsWith("Failed") ? "text-red-600" : "text-green-600"}`}>{addedMsg}</p>
                            )}

                            <Link href="/checkout" className="mt-3 block w-full rounded-xl border-2 border-green-600 py-3 text-center text-base font-bold text-green-600 hover:bg-green-50 transition-colors">
                                Buy Now →
                            </Link>

                            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
                                <span>🚚 Free delivery over $50</span>
                                <span>🔒 Secure checkout</span>
                                <span>↩️ Easy returns</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
