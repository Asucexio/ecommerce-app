"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/hooks/use-cart";
import { validateCheckout, createOrder, createPaymentIntent } from "@/lib/api/checkout";

// Load Stripe outside component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
    const steps = ["Review Cart", "Payment", "Confirmation"];
    return (
        <div className="flex items-center gap-2 mb-8">
            {steps.map((label, i) => {
                const num = i + 1;
                const active = num === step;
                const done = num < step;
                return (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${done ? "bg-green-600 text-white" : active ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                            {done ? "✓" : num}
                        </div>
                        <span className={`text-sm font-medium ${active ? "text-green-700" : done ? "text-green-600" : "text-gray-400"}`}>{label}</span>
                        {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-gray-200" />}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Cart review step ─────────────────────────────────────────────────────────
function CartReview({
    onProceed,
    loading,
    error,
}: {
    onProceed: () => void;
    loading: boolean;
    error: string;
}) {
    const { cart, items } = useCart();
    const subtotal = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Review your cart</h2>
            {items.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
                    <p className="text-gray-500">Your cart is empty.</p>
                    <Link href="/products" className="mt-4 inline-block text-sm font-medium text-green-600 hover:underline">
                        Browse products →
                    </Link>
                </div>
            ) : (
                <>
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-4">
                        <ul className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                        <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Product</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        ${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Subtotal</span>
                            <span className="text-sm font-bold text-gray-900">${(subtotal / 100).toFixed(2)}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={onProceed}
                        disabled={loading || !cart?.id}
                        className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {loading ? "Preparing checkout…" : "Proceed to Payment →"}
                    </button>
                </>
            )}
        </div>
    );
}

// ─── Payment form (inside Elements) ──────────────────────────────────────────
function PaymentForm({
    orderId,
    total,
    onSuccess,
}: {
    orderId: string;
    total: number;
    onSuccess: (orderId: string) => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !elements) return;

        setError("");
        setProcessing(true);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message ?? "Payment failed");
                return;
            }

            const { error: confirmError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/confirmation?order_id=${orderId}`,
                },
            });

            if (confirmError) {
                setError(confirmError.message ?? "Payment failed");
            }
            // On success, Stripe redirects to return_url — onSuccess is called from confirmation page
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setProcessing(false);
        }
    }

    return (
        <form onSubmit={(e) => void handleSubmit(e)}>
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Payment details</h2>
                <PaymentElement />
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
                {processing ? "Processing payment…" : `Pay $${(total / 100).toFixed(2)}`}
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
                🔒 Payments are secured by Stripe
            </p>
        </form>
    );
}

// ─── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
    const { cart, items, initCart } = useCart();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [totalCents, setTotalCents] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        void initCart();
    }, [initCart]);

    const handleProceedToPayment = useCallback(async () => {
        if (!cart?.id) {
            setError("No active cart found.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await validateCheckout({ cartId: cart.id });
            const order = await createOrder({ cartId: cart.id });
            const payment = await createPaymentIntent({ orderId: order.orderId });

            if (!payment.clientSecret) {
                setError("Failed to create payment. Please try again.");
                return;
            }

            setOrderId(order.orderId);
            setClientSecret(payment.clientSecret);
            setTotalCents(items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0));
            setStep(2);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [cart?.id, items]);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-4 py-4">
                <div className="mx-auto max-w-2xl flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-green-600">NovaCart</Link>
                    <Link href="/cart" className="text-sm text-gray-500 hover:text-gray-700">← Back to cart</Link>
                </div>
            </div>

            <div className="mx-auto max-w-2xl px-4 py-8">
                <StepIndicator step={step} />

                {step === 1 && (
                    <CartReview
                        onProceed={() => void handleProceedToPayment()}
                        loading={loading}
                        error={error}
                    />
                )}

                {step === 2 && clientSecret && orderId && (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: "stripe",
                                variables: {
                                    colorPrimary: "#16a34a",
                                    borderRadius: "8px",
                                },
                            },
                        }}
                    >
                        <PaymentForm
                            orderId={orderId}
                            total={totalCents}
                            onSuccess={() => setStep(3)}
                        />
                    </Elements>
                )}
            </div>
        </main>
    );
}
