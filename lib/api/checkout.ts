import { apiRequest } from "@/lib/api/client";

export async function validateCheckout(payload: { cartId: string }, token?: string | null) {
    return apiRequest<{ valid: boolean; items: unknown[]; totalCents: number }>("/api/checkout/validate", {
        method: "POST",
        body: payload,
        token,
    });
}

export async function createOrder(payload: { cartId: string }, token?: string | null) {
    return apiRequest<{ orderId: string; status: string }>("/api/checkout/create-order", {
        method: "POST",
        body: payload,
        token,
    });
}

export async function createPaymentIntent(payload: { orderId: string }, token?: string | null) {
    return apiRequest<{ orderId: string; paymentIntentId: string; clientSecret: string | null }>(
        "/api/checkout/create-payment-intent",
        {
            method: "POST",
            body: payload,
            token,
        },
    );
}
