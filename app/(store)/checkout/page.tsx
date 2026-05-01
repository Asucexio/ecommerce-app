"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/hooks/use-cart";
import { createOrder, createPaymentIntent, validateCheckout } from "@/lib/api/checkout";

export default function CheckoutPage() {
    const { cart, initCart } = useCart();
    const [message, setMessage] = useState("");

    useEffect(() => {
        void initCart();
    }, [initCart]);

    async function handleCheckout() {
        try {
            setMessage("Validating cart...");
            if (!cart?.id) throw new Error("No active cart found");

            await validateCheckout({ cartId: cart.id });

            setMessage("Creating order...");
            const order = await createOrder({ cartId: cart.id });

            setMessage("Creating payment intent...");
            const payment = await createPaymentIntent({ orderId: order.orderId });

            setMessage(`Ready to pay. clientSecret: ${payment.clientSecret ?? "(missing)"}`);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Checkout failed");
        }
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
            <p className="rounded border p-2 text-sm">Cart ID: {cart?.id ?? "No active cart"}</p>
            <button className="mt-3 rounded border px-3 py-2" onClick={() => void handleCheckout()}>
                Run checkout flow
            </button>
            {message && <p className="mt-3">{message}</p>}
        </main>
    );
}