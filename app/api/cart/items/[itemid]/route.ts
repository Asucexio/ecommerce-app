import { resolveRequestContext } from "@/lib/auth/request-context";
import { deleteCartItem, getActiveCartByOwner, updateCartItemQuantity } from "@/lib/domains/cart/cart.repository";
import { updateCartItemSchema } from "@/lib/domains/cart/cart.validitors";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

async function canAccessItem(itemId: string, userId: string | null, guestToken: string | null) {
    const cart = await getActiveCartByOwner({ userId, guestToken });
    if (!cart) return false;

    return cart.items.some((item) => item.id === itemId);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ itemid: string }> }) {
    const context = await resolveRequestContext(request);
    const { itemid } = await params;
    const itemId = itemid;
    const body = await request.json().catch(() => null);
    const parsed = updateCartItemSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    if (!(await canAccessItem(itemId, context.userId, context.guestToken))) {
        return apiError({ code: "FORBIDDEN", message: "Cart item access denied" }, 403);
    }

    try {
        const item = await updateCartItemQuantity(itemId, parsed.data.quantity);
        return apiSuccess({ item });
    } catch (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Failed" }, 500);
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ itemid: string }> }) {
    const context = await resolveRequestContext(_request);
    const { itemid } = await params;
    const itemId = itemid;

    if (!(await canAccessItem(itemId, context.userId, context.guestToken))) {
        return apiError({ code: "FORBIDDEN", message: "Cart item access denied" }, 403);
    }

    try {
        await deleteCartItem(itemId);
        return apiSuccess({ deleted: true });
    } catch (error) {
        return apiError({ code: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Failed" }, 500);
    }
}