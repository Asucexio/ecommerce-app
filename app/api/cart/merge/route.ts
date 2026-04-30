import { requireUser } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { mergeGuestCartToUser } from "@/lib/domains/cart/cart.repository";
import { mergeCartSchema } from "@/lib/domains/cart/cart.validitors";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const authError = requireUser(context);

    if (authError) return authError;

    const body = await request.json().catch(() => null);
    const parsed = mergeCartSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    try {
        const merged = await mergeGuestCartToUser(context.userId!, parsed.data.sourceGuestToken);
        return apiSuccess({ cart: merged?.cart ?? null, items: merged?.items ?? [] });
    } catch (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Failed" }, 500);
    }
}
