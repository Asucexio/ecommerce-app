"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentStatus = "success" | "processing" | "failed" | "loading";

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");

    const [status, setStatus] = useState<PaymentStatus>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!paymentIntentClientSecret) {
            // Navigated here directly (not from Stripe redirect)
            if (orderId) {
                setStatus("success");
            } else {
                setStatus("failed");
                setMessage("No order information found.");
            }
            return;
        }

        async function checkStatus() {
            const stripe = await stripePromise;
            if (!stripe) return;

            const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret!);

            switch (paymentIntent?.status) {
                case "succeeded":
                    setStatus("success");
                    break;
                case "processing":
                    setStatus("processing");
                    setMessage("Your payment is being processed. We'll email you once confirmed.");
                    break;
                case "requires_payment_method":
                    setStatus("failed");
                    setMessage("Payment failed. Please try again.");
                    break;
                default:
                    setStatus("failed");
                    setMessage("Something went wrong with your payment.");
            }
        }

        void checkStatus();
    }, [paymentIntentClientSecret, orderId]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md text-center">
                {/* Logo */}
                <Link href="/" className="mb-8 inline-block text-2xl font-bold text-green-600">
                    NovaCart
                </Link>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
                            <p className="text-sm text-gray-500">Confirming your payment…</p>
                        </div>
                    )}

                    {status === "success" && (
                        <>
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="mb-2 text-2xl font-semibold text-gray-900">Order confirmed!</h1>
                            <p className="mb-1 text-sm text-gray-500">Thank you for your purchase.</p>
                            {orderId && (
                                <p className="mb-6 font-mono text-xs text-gray-400">Order: {orderId.slice(0, 8)}…</p>
                            )}
                            <div className="flex flex-col gap-3">
                                {orderId && (
                                    <Link
                                        href={`/account/order/${orderId}`}
                                        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                                    >
                                        View Order Details
                                    </Link>
                                )}
                                <Link
                                    href="/products"
                                    className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    )}

                    {status === "processing" && (
                        <>
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="mb-2 text-2xl font-semibold text-gray-900">Payment processing</h1>
                            <p className="mb-6 text-sm text-gray-500">{message}</p>
                            <Link href="/account/order" className="text-sm font-medium text-green-600 hover:underline">
                                View my orders
                            </Link>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="mb-2 text-2xl font-semibold text-gray-900">Payment failed</h1>
                            <p className="mb-6 text-sm text-gray-500">{message || "Your payment could not be processed."}</p>
                            <Link
                                href="/checkout"
                                className="w-full inline-block rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                            >
                                Try again
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
