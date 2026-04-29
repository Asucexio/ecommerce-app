import Stripe from "stripe";

import { requireUser } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { getServerConfig } from "@/lib/config/env";
import { createPaymentIntentSchema } from "@/lib/domains/checkout/checkout.validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const authError = requireUser(context);

    if (authError) return authError;

    const body = await request.json().catch(() => null);
    const parsed = createPaymentIntentSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const admin = createSupabaseAdminClient();
    const { data: order, error: orderError } = await admin
        .from("orders")
        .select("id, user_id, total_cents, currency")
        .eq("id", parsed.data.orderId)
        .single();

    if (orderError || !order || order.user_id !== context.userId) {
        return apiError({ code: "FORBIDDEN", message: "Order access denied" }, 403);
    }

    const stripe = new Stripe(getServerConfig().stripeSecretKey);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total_cents,
        currency: order.currency.toLowerCase(),
        metadata: {
            order_id: order.id,
            user_id: context.userId!,
        },
    });

    const { error: paymentError } = await admin.from("payments").upsert(
        {
            order_id: order.id,
            provider: "stripe",
            payment_intent_id: paymentIntent.id,
            status: paymentIntent.status as "requires_payment_method" | "processing" | "succeeded" | "failed" | "canceled",
            amount_cents: order.total_cents,
            currency: order.currency,
            metadata: paymentIntent.metadata,
        },
        { onConflict: "payment_intent_id" },
    );

    if (paymentError) {
        return apiError({ code: "INTERNAL_ERROR", message: paymentError.message }, 500);
    }

    return apiSuccess({
        orderId: order.id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
    });
}
