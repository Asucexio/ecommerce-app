"use client";

import { useCallback } from "react";

import { addCartItem, createCart, deleteCartItem, getActiveCart, mergeGuestCart, updateCartItem } from "@/lib/api/cart";
import { ApiClientError } from "@/lib/api/client";
import { ensureGuestToken } from "@/lib/auth/guest-token";
import { useCartStore } from "@/stores/use-cart";

export function useCart(token?: string | null) {
    const { cart, items, loading, error, setCartState, setLoading, setError } = useCartStore();

    const withState = useCallback(async <T,>(fn: () => Promise<T>) => {
        try {
            setLoading(true);
            setError(null);
            return await fn();
        } catch (err) {
            const message = err instanceof ApiClientError ? err.message : "Something went wrong";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading]);


    const initCart = useCallback(async () => {
        return withState(async () => {
            const data = await getActiveCart(token);

            if (data.cart) {
                setCartState(data);
                return data;
            }

            const guestToken = ensureGuestToken();
            const created = await createCart({ guestToken }, token);
            setCartState(created);
            return created;
        });
    }, [setCartState, token, withState]);

    const loadCart = useCallback(async () => {
        return withState(async () => {
            const data = await getActiveCart(token);
            setCartState(data);
            return data;
        });
    }, [setCartState, token, withState]);

    const ensureGuestCart = useCallback(async (guestToken: string) => {
        return withState(async () => {
            const data = await createCart({ guestToken }, token);
            setCartState(data);
            return data;
        });
    }, [setCartState, token, withState]);

    const addItem = useCallback(async (payload: { cartId: string; productId: string; quantity: number }) => {
        return withState(async () => {
            await addCartItem(payload, token);
            return loadCart();
        });
    }, [loadCart, token, withState]);

    const updateItem = useCallback(async (itemId: string, quantity: number) => {
        return withState(async () => {
            await updateCartItem(itemId, { quantity }, token);
            return loadCart();
        });
    }, [loadCart, token, withState]);

    const removeItem = useCallback(async (itemId: string) => {
        return withState(async () => {
            await deleteCartItem(itemId, token);
            return loadCart();
        });
    }, [loadCart, token, withState]);

    const mergeGuest = useCallback(async (sourceGuestToken: string) => {
        return withState(async () => {
            const data = await mergeGuestCart({ sourceGuestToken }, token);
            setCartState(data);
            return data;
        });
    }, [setCartState, token, withState]);

    return {
        cart,
        items,
        loading,
        error,
        initCart,
        loadCart,
        ensureGuestCart,
        addItem,
        updateItem,
        removeItem,
        mergeGuest,
    };
}
