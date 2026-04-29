import { requireAdmin } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { updateOrderStatusSchema } from "@/lib/domains/payment/payments.validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const context = await resolveRequestContext(request);
    const adminError = requireAdmin(context);

    if (adminError) return adminError;

    const body = await request.json().catch(() => null);
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const { orderId } = await params;
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin
        .from("orders")
        .update({ status: parsed.data.status })
        .eq("id", orderId)
        .select("*")
        .maybeSingle();

    if (error) return apiError({ code: "INTERNAL_ERROR", message: error.message }, 500);
    if (!data) return apiError({ code: "NOT_FOUND", message: "Order not found" }, 404);

    return apiSuccess({ order: data });
}
