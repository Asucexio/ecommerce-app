import { requireUser } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function GET(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const context = await resolveRequestContext(request);
    const authError = requireUser(context);

    if (authError) return authError;

    const { orderId } = await params;
    const admin = createSupabaseAdminClient();

    const { data: order, error: orderError } = await admin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("user_id", context.userId!)
        .maybeSingle();

    if (orderError) return apiError({ code: "INTERNAL_ERROR", message: orderError.message }, 500);
    if (!order) return apiError({ code: "NOT_FOUND", message: "Order not found" }, 404);

    const { data: items, error: itemsError } = await admin
        .from("order_items")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true });

    if (itemsError) return apiError({ code: "INTERNAL_ERROR", message: itemsError.message }, 500);

    return apiSuccess({ order, items });
}
