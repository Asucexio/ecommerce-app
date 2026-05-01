import { create } from "zustand";

import type { CartDto, CartItemDto } from "@/lib/types/frontend/cart";

type CartState = {
    cart: CartDto | null;
    items: CartItemDto[];
    loading: boolean;
    error: string | null;
    setCartState: (input: { cart: CartDto | null; items: CartItemDto[] }) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
    cart: null,
    items: [],
    loading: false,
    error: null,
    setCartState: (input) => set({ cart: input.cart, items: input.items }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearCart: () => set({ cart: null, items: [] }),
}));
