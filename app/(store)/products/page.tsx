"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const { addItem } = useCart();

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await fetch("/api/catalog/products?limit=50&active=true");
                const json = (await response.json().catch(() => null)) as
                    | { data?: { items?: Product[] }; error?: { message?: string } }
                    | null;

                if (!response.ok) {
                    setError(json?.error?.message ?? "Failed to load products");
                    return;
                }

                const items = json?.data?.items ?? [];
                setProducts(items);

                // Initialize quantities
                const initialQuantities: Record<string, number> = {};
                items.forEach((product) => {
                    initialQuantities[product.id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Request failed");
            } finally {
                setLoading(false);
            }
        }

        void loadProducts();
    }, []);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantities((prev) => ({
                ...prev,
                [productId]: newQuantity,
            }));
        }
    };

    const handleAddToCart = async (product: Product) => {
        try {
            await addItem({
                cartId: "temp", // This will be handled by the hook
                productId: product.id,
                quantity: quantities[product.id],
            });
        } catch (err) {
            console.error("Failed to add item:", err);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Navigation & Promo Bar */}
            <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                    <a href="#" className="text-sm font-semibold text-gray-700 hover:text-green-600">
                        Trending Products
                    </a>
                    <button className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 transition-colors flex items-center gap-2">
                        Get 30% Discount Now
                        <span className="inline-block rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">Sale</span>
                    </button>
                </div>
            </div>

            {/* Products Section */}
            <section className="mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
                    <p className="mt-2 text-gray-600">Browse our complete collection of fresh groceries</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="mt-4 text-gray-600">Loading products...</p>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group rounded-lg border border-gray-200 bg-white transition-all hover:border-green-300 hover:shadow-lg overflow-hidden flex flex-col"
                            >
                                {/* Product Image Container */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {/* Discount Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <div className="bg-yellow-400 text-gray-900 rounded-md px-2 py-1 font-bold text-xs">
                                            <div>25%</div>
                                            <div className="text-xs">Off</div>
                                        </div>
                                    </div>

                                    {/* Product Image */}
                                    <svg
                                        className="h-24 w-24 text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col flex-1 p-3">
                                    {/* Product Name */}
                                    <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-green-600 transition-colors">
                                        {product.name}
                                    </h3>

                                    {/* Package Size */}
                                    <p className="text-xs text-gray-600 mb-2">500g Pack</p>

                                    {/* Pricing */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="text-lg font-bold text-red-600">
                                            ${(product.price_cents / 100 * 0.75).toFixed(2)}
                                        </span>
                                        <span className="text-xs text-gray-500 line-through">
                                            ${(product.price_cents / 100).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Quantity & Add Button */}
                                    <div className="mt-auto flex items-center gap-2">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-green-600 rounded-md">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        product.id,
                                                        Math.max(1, quantities[product.id] - 1)
                                                    )
                                                }
                                                className="px-2 py-1 text-green-600 hover:bg-green-50 transition-colors"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantities[product.id]}
                                                onChange={(e) =>
                                                    handleQuantityChange(product.id, parseInt(e.target.value) || 1)
                                                }
                                                className="w-10 text-center border-l border-r border-green-600 py-1 text-sm focus:outline-none"
                                                min="1"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(product.id, quantities[product.id] + 1)
                                                }
                                                className="px-2 py-1 text-green-600 hover:bg-green-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Add Button */}
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 rounded-md border border-green-600 bg-white px-2 py-1 text-center font-semibold text-green-600 transition-all hover:bg-green-600 hover:text-white text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-8">
                        <div>
                            <h3 className="mb-4 text-xl font-bold text-green-400">NovaCart</h3>
                            <p className="text-sm text-gray-400">
                                Your trusted online grocery store for fresh products delivered fast.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold">Shop</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link href="/" className="hover:text-green-400 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        Best Deals
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        New Arrivals
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-400 transition-colors">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2024 NovaCart. All rights reserved. | Delivered Daily from 7:00 to 22:00</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
