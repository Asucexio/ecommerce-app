"use client";

import Link from "next/link";
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
    subtotal_cents: number;
    shipping_cents: number;
    tax_cents: number;
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: "bg-slate-100", text: "text-slate-600", label: "Draft" },
    pending_payment: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending Payment" },
    paid: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Paid" },
    failed: { bg: "bg-red-50", text: "text-red-600", label: "Failed" },
    canceled: { bg: "bg-slate-100", text: "text-slate-500", label: "Canceled" },
};

export default function AccountOrderDetailPage({ params }: { params: { order_id: string } }) {
    const [order, setOrder] = useState<OrderDetailDto | null>(null);
    const [items, setItems] = useState<OrderItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrder() {
            try {
                // Fixed: was /api/order/:id, correct path is /api/orders/:id
                const response = await fetch(`/api/orders/${params.order_id}`, { cache: "no-store" });
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

    const status = order ? (statusColors[order.status] ?? { bg: "bg-gray-100", text: "text-gray-600", label: order.status }) : null;

    return (
        <main className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link href="/account/order" className="text-sm text-gray-500 hover:text-green-600">
                    ← My Orders
                </Link>
            </div>

            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Order Details</h1>
                    <p className="mt-1 font-mono text-xs text-gray-400">{params.order_id}</p>
                </div>
                {status && order && (
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                    </span>
                )}
            </div>

            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600" />
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            )}

            {order && (
                <div className="grid gap-5 lg:grid-cols-3">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-5 py-4">
                                <h2 className="text-base font-semibold text-gray-800">Items Ordered</h2>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                            <svg className="h-7 w-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ${(item.unit_price_cents / 100).toFixed(2)}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">${(item.line_total_cents / 100).toFixed(2)}</p>
                                    </li>
                                ))}
                                {!loading && items.length === 0 && (
                                    <li className="px-5 py-8 text-center text-sm text-gray-500">No items found for this order.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-base font-semibold text-gray-800">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${(order.subtotal_cents / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{order.shipping_cents === 0 ? "Free" : `$${(order.shipping_cents / 100).toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>${(order.tax_cents / 100).toFixed(2)}</span>
                                </div>
                                <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
                                    <span>Total</span>
                                    <span>{order.currency} {(order.total_cents / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-base font-semibold text-gray-800">Order Info</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Placed</span>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment</span>
                                    <span className="capitalize">{order.status.replace(/_/g, " ")}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/products" className="block w-full rounded-lg border border-green-600 py-2.5 text-center text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}
