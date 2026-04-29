import { requireAdmin } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { inventoryAdjustSchema } from "@/lib/domains/payment/payments.validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const adminError = requireAdmin(context);

    if (adminError) return adminError;

    const body = await request.json().catch(() => null);
    const parsed = inventoryAdjustSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from("products")
        .update({ price_cents: parsed.data.price_cents })
        .eq("id", parsed.data.productId)
        .select("id, name, price_cents")
        .maybeSingle();

    if (error) return apiError({ code: "INTERNAL_ERROR", message: error.message }, 500);
    if (!data) return apiError({ code: "NOT_FOUND", message: "Product not found" }, 404);

    return apiSuccess({ product: data });
}
