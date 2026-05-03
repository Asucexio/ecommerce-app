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

const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    pending_payment: "bg-amber-50 text-amber-700",
    paid: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-600",
    canceled: "bg-slate-100 text-slate-500",
};

export default function AccountOrderListPage() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            try {
                // Fixed: was /api/order, correct path is /api/orders
                const response = await fetch("/api/orders", { cache: "no-store" });
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
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">My Orders</h1>
                <p className="mt-1 text-sm text-gray-500">Track and manage your orders</p>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600" />
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700">No orders yet</p>
                    <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here</p>
                    <Link href="/products" className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                        Browse Products
                    </Link>
                </div>
            )}

            {orders.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold text-gray-600">Order ID</th>
                                <th className="px-5 py-3.5 font-semibold text-gray-600">Date</th>
                                <th className="px-5 py-3.5 font-semibold text-gray-600">Status</th>
                                <th className="px-5 py-3.5 font-semibold text-gray-600">Total</th>
                                <th className="px-5 py-3.5 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}…</td>
                                    <td className="px-5 py-4 text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                            {order.status.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-gray-900">
                                        {order.currency} {(order.total_cents / 100).toFixed(2)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/account/order/${order.id}`} className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline">
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
