"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type AuthUser = {
    userId: string | null;
    isAdmin: boolean;
    role: "admin" | "customer" | "guest";
};

type AuthContextType = {
    auth: AuthUser | null;
    loading: boolean;
    refetch: () => void;
};

const AuthContext = createContext<AuthContextType>({
    auth: null,
    loading: true,
    refetch: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchAuth() {
        try {
            const res = await fetch("/api/auth/me", { cache: "no-store" });
            const json = (await res.json().catch(() => null)) as { data?: AuthUser } | null;
            setAuth(json?.data ?? null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void fetchAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, loading, refetch: () => void fetchAuth() }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
