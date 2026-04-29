import { resolveRequestContext } from "@/lib/auth/request-context";
import { addCartItemSchema } from "@/lib/domains/cart/cart.validitors";
import { getActiveCartByOwner, upsertCartItem } from "@/lib/domains/cart/cart.repository";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const body = await request.json().catch(() => null);
    const parsed = addCartItemSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const ownerCart = await getActiveCartByOwner({ userId: context.userId, guestToken: context.guestToken });

    if (!ownerCart || ownerCart.cart.id !== parsed.data.cartId) {
        return apiError({ code: "FORBIDDEN", message: "Cart access denied" }, 403);
    }

    try {
        const item = await upsertCartItem(parsed.data);
        return apiSuccess({ item }, { status: 201 });
    } catch (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Failed" }, 500);
    }
}
