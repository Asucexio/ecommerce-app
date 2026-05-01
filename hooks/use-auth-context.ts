"use client";

import { useEffect, useState } from "react";

export type AuthContextDto = {
    userId: string | null;
    isAdmin: boolean;
    role: "admin" | "customer" | "guest";
};

export function useAuthContext() {
    const [auth, setAuth] = useState<AuthContextDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAuth() {
            try {
                const response = await fetch("/api/auth/me", { cache: "no-store" });
                const json = (await response.json().catch(() => null)) as { data?: AuthContextDto } | null;
                setAuth(json?.data ?? null);
            } finally {
                setLoading(false);
            }
        }

        void loadAuth();
    }, []);

    return { auth, loading };
}