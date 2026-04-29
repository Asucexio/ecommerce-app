import { requireUser } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function GET(request: Request) {
    const context = await resolveRequestContext(request);
    const authError = requireUser(context);

    if (authError) return authError;

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from("orders")
        .select("*")
        .eq("user_id", context.userId!)
        .order("created_at", { ascending: false });

    if (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error.message }, 500);
    }

    return apiSuccess({ orders: data });
}
