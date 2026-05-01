"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/hooks/use-auth-context";

const statuses = ["draft", "pending_payment", "paid", "failed", "canceled"] as const;

export default function AdminOrderPage() {
    const router = useRouter();
    const { auth, loading: authLoading } = useAuthContext();

    const [orderId, setOrderId] = useState("");
    const [status, setStatus] = useState<(typeof statuses)[number]>("pending_payment");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !auth?.isAdmin) {
            router.replace("/");
        }
    }, [auth?.isAdmin, authLoading, router]);

    if (authLoading || !auth?.isAdmin) {
        return <main className="p-6">Checking admin access...</main>;
    }

    async function onUpdateStatus() {
        if (!orderId) {
            setMessage("Order ID is required");
            return;
        }

        setSubmitting(true);
        setMessage("");

        try {
            const response = await fetch(`/api/admin/order/${orderId}/status`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const json = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;

            if (!response.ok) {
                setMessage(json?.error?.message ?? "Failed to update order status");
                return;
            }

            setMessage("Order status updated successfully");
            setOrderId("");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Request failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto grid max-w-[1440px] grid-cols-12">
                <aside className="col-span-12 border-r bg-white p-6 lg:col-span-3 xl:col-span-2">
                    <h1 className="mb-8 text-3xl font-bold">NovaCart</h1>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p>
                    <nav className="space-y-2">
                        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/admin">
                            Dashboard
                        </Link>
                        <Link className="block rounded-lg bg-blue-50 px-3 py-2 text-blue-700" href="/admin/order">
                            Orders
                        </Link>
                        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/admin/products">
                            Products
                        </Link>
                    </nav>
                </aside>

                <section className="col-span-12 p-6 lg:col-span-9 xl:col-span-10">
                    <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                        <h2 className="text-3xl font-semibold">Order Management</h2>
                        <p className="mt-1 text-sm text-slate-500">Update order lifecycle status by order ID.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                        <section className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
                            <h3 className="mb-4 text-xl font-semibold">Update Status</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">Order ID</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-400"
                                        placeholder="Order ID (UUID)"
                                        value={orderId}
                                        onChange={(event) => setOrderId(event.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-slate-600">Status</label>
                                    <select
                                        className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-400"
                                        value={status}
                                        onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])}
                                    >
                                        {statuses.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    onClick={() => void onUpdateStatus()}
                                    disabled={submitting}
                                >
                                    {submitting ? "Updating..." : "Update Order"}
                                </button>

                                {message && <p className="text-sm text-slate-700">{message}</p>}
                            </div>
                        </section>

                        <aside className="rounded-2xl bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-xl font-semibold">Quick Notes</h3>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                                <li>Use valid UUID order IDs.</li>
                                <li>Only admin-authenticated users can update status.</li>
                                <li>Allowed statuses: draft, pending_payment, paid, failed, canceled.</li>
                            </ul>
                        </aside>
                    </div>
                </section>
            </div>
        </main>
    );
}