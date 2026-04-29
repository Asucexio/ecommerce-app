import Stripe from "stripe";

import { getServerConfig } from "@/lib/config/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/types/database";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const { stripeSecretKey, stripeWebhookSecret } = getServerConfig();
    const stripe = new Stripe(stripeSecretKey);

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return apiError({ code: "VALIDATION_ERROR", message: "Missing stripe-signature header" }, 400);
    }

    const payload = await request.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
    } catch (error) {
        return apiError({ code: "VALIDATION_ERROR", message: error instanceof Error ? error.message : "Invalid signature" }, 400);
    }

    const admin = createSupabaseAdminClient();

    const { data: existing } = await admin
        .from("payment_events")
        .select("id")
        .eq("provider_event_id", event.id)
        .maybeSingle();

    if (existing) {
        return apiSuccess({ received: true, duplicate: true });
    }

    await admin.from("payment_events").insert({
        provider: "stripe",
        provider_event_id: event.id,
        event_type: event.type,
        payload: JSON.parse(JSON.stringify(event)) as Json,
    });

    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const nextPaymentStatus = event.type === "payment_intent.succeeded" ? "succeeded" : "failed";
        const nextOrderStatus = event.type === "payment_intent.succeeded" ? "paid" : "failed";

        await admin
            .from("payments")
            .update({ status: nextPaymentStatus })
            .eq("payment_intent_id", paymentIntent.id);

        const { data: payment } = await admin
            .from("payments")
            .select("order_id")
            .eq("payment_intent_id", paymentIntent.id)
            .maybeSingle();

        if (payment?.order_id) {
            await admin
                .from("orders")
                .update({ status: nextOrderStatus, payment_status: nextPaymentStatus })
                .eq("id", payment.order_id);
        }
    }

    await admin.from("payment_events").update({ processed_at: new Date().toISOString() }).eq("provider_event_id", event.id);

    return apiSuccess({ received: true });
}
