"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthContext } from "@/hooks/use-auth-context";

export default function AdminProductsPage() {
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
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-semibold">Admin — Products</h1>
            <p>Starter page. Connect this to create/update product APIs next.</p>
        </main>
    );
}