"use client";

import { useEffect, useState } from "react";

type OrderItemDto = {
    id: string;
    product_name: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
};

type OrderDetailDto = {
    id: string;
    status: string;
    total_cents: number;
    currency: string;
    created_at: string;
};

export default function AccountOrderDetailPage({ params }: { params: { order_id: string } }) {
    const [order, setOrder] = useState<OrderDetailDto | null>(null);
    const [items, setItems] = useState<OrderItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrder() {
            try {
                const response = await fetch(`/api/order/${params.order_id}`, { cache: "no-store" });
                const json = (await response.json().catch(() => null)) as
                    | { data?: { order?: OrderDetailDto; items?: OrderItemDto[] }; error?: { message?: string } }
                    | null;

                if (!response.ok) {
                    setError(json?.error?.message ?? "Failed to load order");
                    return;
                }

                setOrder(json?.data?.order ?? null);
                setItems(json?.data?.items ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Request failed");
            } finally {
                setLoading(false);
            }
        }

        void loadOrder();
    }, [params.order_id]);

    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-2 text-3xl font-semibold">Order Details</h1>
            <p className="mb-4 text-sm text-slate-500">Order ID: {params.order_id}</p>

            {loading && <p>Loading order details...</p>}
            {error && <p className="mb-4 text-red-600">{error}</p>}

            {order && (
                <div className="mb-4 rounded-xl border bg-white p-4 shadow-sm">
                    <p>Status: {order.status}</p>
                    <p>Total: {order.currency} {(order.total_cents / 100).toFixed(2)}</p>
                    <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                </div>
            )}

            <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold">Items</h2>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="rounded border p-3">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm">Qty: {item.quantity}</p>
                            <p className="text-sm">Unit: ${(item.unit_price_cents / 100).toFixed(2)}</p>
                            <p className="text-sm font-semibold">Line Total: ${(item.line_total_cents / 100).toFixed(2)}</p>
                        </li>
                    ))}
                    {!loading && !items.length && <li className="text-slate-500">No items found for this order.</li>}
                </ul>
            </div>
        </main>
    );
}