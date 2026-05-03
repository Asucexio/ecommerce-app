"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    const { initCart } = useCart();

    // Initialize cart once for the whole store
    useEffect(() => {
        void initCart();
    }, [initCart]);

    return <>{children}</>;
}
