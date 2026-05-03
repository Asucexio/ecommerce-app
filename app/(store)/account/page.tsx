"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Header } from "@/components/header";
import { useAuthContext } from "@/hooks/use-auth-context";

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}

export default function AccountPage() {
    const router = useRouter();
    const { auth, loading } = useAuthContext();

    useEffect(() => {
        if (!loading && !auth?.userId) {
            router.push("/auth/login");
        }
    }, [auth, loading, router]);

    async function handleSignOut() {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600" />
                </div>
            </main>
        );
    }

    if (!auth?.userId) return null;

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">My Account</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your profile and orders</p>
                    </div>
                    <button
                        onClick={() => void handleSignOut()}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Sign out
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href="/account/order"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-green-200 hover:shadow-md transition-all"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">My Orders</h2>
                        <p className="mt-1 text-sm text-gray-500">Track and review all your orders</p>
                    </Link>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                        <p className="mt-1 text-sm text-gray-500">Update your personal details and preferences</p>
                        <span className="mt-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">Coming soon</span>
                    </div>

                    {auth.isAdmin && (
                        <Link
                            href="/admin"
                            className="group rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all md:col-span-2"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">Admin Dashboard</h2>
                            <p className="mt-1 text-sm text-blue-600">Manage orders, products, and analytics</p>
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
