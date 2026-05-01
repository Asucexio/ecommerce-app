"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderDto = {
    id: string;
    created_at: string;
    status: string;
    total_cents: number;
    currency: string;
};

export default function AccountOrderListPage() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await fetch("/api/order", { cache: "no-store" });
                const json = (await response.json().catch(() => null)) as
                    | { data?: { orders?: OrderDto[] }; error?: { message?: string } }
                    | null;

                if (!response.ok) {
                    setError(json?.error?.message ?? "Failed to load orders");
                    return;
                }

                setOrders(json?.data?.orders ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Request failed");
            } finally {
                setLoading(false);
            }
        }

        void loadOrders();
    }, []);

    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-4 text-3xl font-semibold">My Orders</h1>
            {loading && <p>Loading orders...</p>}
            {error && <p className="mb-4 text-red-600">{error}</p>}

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                                <td className="px-4 py-3">{new Date(order.created_at).toLocaleString()}</td>
                                <td className="px-4 py-3">{order.status}</td>
                                <td className="px-4 py-3">{order.currency} {(order.total_cents / 100).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <Link href={`/account/order/${order.id}`} className="text-blue-600 underline">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {!loading && !orders.length && (
                            <tr>
                                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}