"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
    const { cart, items, loading, error, initCart, updateItem, removeItem } = useCart();

    useEffect(() => {
        void initCart();
    }, [initCart]);

    const subtotal = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="mx-auto max-w-5xl px-4 py-8">
                <h1 className="mb-6 text-3xl font-semibold text-gray-900">
                    Shopping Cart
                    {totalItems > 0 && <span className="ml-2 text-lg font-normal text-gray-400">({totalItems} items)</span>}
                </h1>

                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600" />
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
                )}

                {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-xl font-medium text-gray-700">Your cart is empty</p>
                        <p className="mt-2 text-sm text-gray-500">Add some groceries to get started</p>
                        <Link href="/products" className="mt-6 inline-block rounded-lg bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                            Browse Products
                        </Link>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 px-5 py-4">
                                    <h2 className="font-semibold text-gray-800">Items in your cart</h2>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                                            {/* Placeholder image */}
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Product</p>
                                                <p className="text-sm text-gray-500">${(item.unit_price_cents / 100).toFixed(2)} each</p>
                                            </div>

                                            {/* Qty controls */}
                                            <div className="flex items-center rounded-lg border border-gray-200">
                                                <button
                                                    onClick={() => void updateItem(item.id, Math.max(1, item.quantity - 1))}
                                                    className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => void updateItem(item.id, item.quantity + 1)}
                                                    className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Line total */}
                                            <p className="w-20 text-right text-sm font-semibold text-gray-900">
                                                ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
                                            </p>

                                            {/* Remove */}
                                            <button
                                                onClick={() => void removeItem(item.id)}
                                                className="ml-2 text-gray-300 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <Link href="/products" className="text-sm font-medium text-green-600 hover:text-green-700">
                                    ← Continue shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <h2 className="mb-4 font-semibold text-gray-800">Order summary</h2>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span>${(subtotal / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${(subtotal / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="mt-5 block w-full rounded-lg bg-green-600 py-3 text-center text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                                >
                                    Proceed to Checkout →
                                </Link>

                                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure checkout powered by Stripe
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
