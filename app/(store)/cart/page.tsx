"use client";

import { useEffect } from "react";

import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
    const { cart, items, loading, error, initCart, updateItem, removeItem } = useCart();

    useEffect(() => {
        void initCart();
    }, [initCart]);

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-semibold">Cart</h1>
            {!cart && <p>No active cart found.</p>}
            {error && <p className="mb-3 text-red-600">{error}</p>}
            {loading && <p>Loading...</p>}

            <ul className="space-y-3">
                {items.map((item) => (
                    <li key={item.id} className="rounded border p-3">
                        <p className="font-medium">Product: {item.product_id}</p>
                        <p>Qty: {item.quantity}</p>
                        <div className="mt-2 flex gap-2">
                            <button className="rounded border px-2 py-1" onClick={() => void updateItem(item.id, Math.max(1, item.quantity - 1))}>
                                -
                            </button>
                            <button className="rounded border px-2 py-1" onClick={() => void updateItem(item.id, item.quantity + 1)}>
                                +
                            </button>
                            <button className="rounded border px-2 py-1 text-red-600" onClick={() => void removeItem(item.id)}>
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}