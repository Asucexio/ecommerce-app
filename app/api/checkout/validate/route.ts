import { requireUser } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { checkoutValidateSchema } from "@/lib/domains/checkout/checkout.validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const authError = requireUser(context);

    if (authError) return authError;

    const body = await request.json().catch(() => null);
    const parsed = checkoutValidateSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const admin = createSupabaseAdminClient();
    const { data: cart, error: cartError } = await admin
        .from("carts")
        .select("id, user_id, status")
        .eq("id", parsed.data.cartId)
        .single();

    if (cartError || !cart || cart.user_id !== context.userId || cart.status !== "active") {
        return apiError({ code: "FORBIDDEN", message: "Cart not available for checkout" }, 403);
    }

    const { data: items, error: itemsError } = await admin.from("cart_items").select("*").eq("cart_id", cart.id);

    if (itemsError) {
        return apiError({ code: "INTERNAL_ERROR", message: itemsError.message }, 500);
    }

    const subtotal = items.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);

    return apiSuccess({ valid: items.length > 0, issues: items.length ? [] : ["Cart is empty"], subtotal_cents: subtotal });
}
