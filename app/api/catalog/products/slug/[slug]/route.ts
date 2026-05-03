import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

    if (error) return apiError({ code: "INTERNAL_ERROR", message: error.message }, 500);
    if (!data) return apiError({ code: "NOT_FOUND", message: "Product not found" }, 404);

    return apiSuccess({ product: data });
}
