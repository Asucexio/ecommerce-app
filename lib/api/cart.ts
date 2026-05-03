import { apiRequest } from "@/lib/api/client";
import { getGuestToken } from "@/lib/auth/guest-token";
import type { CartDto, CartItemDto } from "@/lib/types/frontend/cart";

type CartResponse = {
    cart: CartDto | null;
    items: CartItemDto[];
};

// Read the guest token once per call — works on both client and server
function guestToken() {
    return getGuestToken();
}

export async function getActiveCart(token?: string | null) {
    return apiRequest<CartResponse>("/api/cart", { token, guestToken: guestToken() });
}

export async function createCart(payload: { guestToken?: string }, token?: string | null) {
    return apiRequest<CartResponse>("/api/cart", {
        method: "POST",
        body: payload,
        token,
        guestToken: guestToken(),
    });
}

export async function addCartItem(
    payload: { cartId: string; productId: string; quantity: number },
    token?: string | null,
) {
    return apiRequest<{ item: CartItemDto }>("/api/cart/items", {
        method: "POST",
        body: payload,
        token,
        guestToken: guestToken(),
    });
}

export async function updateCartItem(itemId: string, payload: { quantity: number }, token?: string | null) {
    return apiRequest<{ item: CartItemDto }>(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        body: payload,
        token,
        guestToken: guestToken(),
    });
}

export async function deleteCartItem(itemId: string, token?: string | null) {
    return apiRequest<{ deleted: boolean }>(`/api/cart/items/${itemId}`, {
        method: "DELETE",
        token,
        guestToken: guestToken(),
    });
}

export async function mergeGuestCart(payload: { sourceGuestToken: string }, token?: string | null) {
    return apiRequest<CartResponse>("/api/cart/merge", {
        method: "POST",
        body: payload,
        token,
        guestToken: guestToken(),
    });
}