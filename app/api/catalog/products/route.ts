import { createProductSchema } from "@/lib/domains/catalog/catalog.validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { productListQuerySchema } from "@/lib/validators/product-query";
import { requireAdmin } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { apiError, apiSuccess } from "@/lib/shared/http/response";
import { listProducts } from "@/lib/repositories/products";


export async function GET(request: Request) {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = productListQuerySchema.safeParse(rawQuery);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid query", details: parsed.error.flatten() }, 400);
    }

    try {
        const products = await listProducts(parsed.data);
        return apiSuccess({ items: products });
    } catch (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Failed" }, 500);
    }
}

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const adminError = requireAdmin(context);

    if (adminError) return adminError;

    const body = await request.json().catch(() => null);
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.from("products").insert(parsed.data).select("*").single();

    if (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error.message }, 500);
    }

    return apiSuccess({ product: data }, { status: 201 });
}
