"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthContext } from "@/hooks/use-auth-context";

const stats = [
    { label: "Clicks", value: "15,352", change: "+3.02%", positive: true },
    { label: "Sales", value: "8,764", change: "-1.15%", positive: false },
    { label: "Events", value: "5,123", change: "+4.78%", positive: true },
    { label: "Users", value: "12,945", change: "+2.35%", positive: true },
];

const regions = [
    ["United States", "659k"],
    ["Russia", "485k"],
    ["China", "355k"],
    ["Canada", "204k"],
] as const;

export default function AdminHomePage() {
    const router = useRouter();
    const { auth, loading } = useAuthContext();

    useEffect(() => {
        if (!loading && !auth?.isAdmin) {
            router.replace("/");
        }
    }, [auth?.isAdmin, loading, router]);

    if (loading || !auth?.isAdmin) {
        return <main className="p-6">Checking admin access...</main>;
    }

    return (
        <main className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto grid max-w-[1440px] grid-cols-12">
                <aside className="col-span-12 border-r bg-white p-6 lg:col-span-3 xl:col-span-2">
                    <h1 className="mb-8 text-3xl font-bold">NovaCart</h1>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p>
                    <nav className="space-y-2">
                        <Link className="block rounded-lg bg-blue-50 px-3 py-2 text-blue-700" href="/admin">
                            Dashboard
                        </Link>
                        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/admin/order">
                            Orders
                        </Link>
                        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100" href="/admin/products">
                            Products
                        </Link>
                    </nav>
                </aside>

                <section className="col-span-12 p-6 lg:col-span-9 xl:col-span-10">
                    <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                        <h2 className="text-3xl font-semibold">Dashboard</h2>
                        <p className="mt-1 text-sm text-slate-500">Commerce analytics overview</p>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => (
                            <article key={item.label} className="rounded-2xl bg-white p-5 shadow-sm">
                                <p className="text-sm text-slate-500">{item.label}</p>
                                <p className="mt-2 text-4xl font-bold">{item.value}</p>
                                <p className={`mt-3 text-sm font-semibold ${item.positive ? "text-emerald-600" : "text-rose-500"}`}>
                                    {item.change} <span className="font-normal text-slate-500">from last month</span>
                                </p>
                            </article>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        <section className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-2xl font-semibold">Top Pages</h3>
                                <div className="space-x-2 text-sm">
                                    <button className="rounded border px-2 py-1">ALL</button>
                                    <button className="rounded border px-2 py-1">1M</button>
                                    <button className="rounded border px-2 py-1">6M</button>
                                    <button className="rounded bg-slate-200 px-2 py-1">1Y</button>
                                </div>
                            </div>
                            <div className="h-72 rounded-xl bg-slate-100 p-4 text-sm text-slate-500">
                                Chart area placeholder (connect chart library here)
                            </div>
                        </section>

                        <section className="rounded-2xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-2xl font-semibold">Sessions by Country</h3>
                            <ul className="space-y-4">
                                {regions.map(([name, value]) => (
                                    <li key={name} className="flex items-center justify-between border-b pb-2 text-sm">
                                        <span>{name}</span>
                                        <strong>{value}</strong>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </section>
            </div>
        </main>
    );
}