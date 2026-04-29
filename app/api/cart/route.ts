import { resolveRequestContext } from "@/lib/auth/request-context";
import { createActiveCart, getActiveCartByOwner } from "@/lib/domains/cart/cart.repository";
import { createCartSchema } from "@/lib/domains/cart/cart.validitors";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function GET(request: Request) {
    const context = await resolveRequestContext(request);

    try {
        const existing = await getActiveCartByOwner({
            userId: context.userId,
            guestToken: context.guestToken,
        });

        if (!existing) {
            return apiSuccess({ cart: null, items: [] });
        }

        return apiSuccess(existing);
    } catch (error) {
        return apiError(
            {
                code: "INTERNAL_ERROR",
                message: error instanceof Error ? error.message : "Failed to load cart",
            },
            500,
        );
    }
}

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);

    let body: unknown = {};

    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const parsed = createCartSchema.safeParse(body);

    if (!parsed.success) {
        return apiError(
            {
                code: "VALIDATION_ERROR",
                message: "Invalid cart payload",
                details: parsed.error.flatten(),
            },
            400,
        );
    }

    const guestToken = context.userId ? null : (parsed.data.guestToken ?? context.guestToken);

    if (!context.userId && !guestToken) {
        return apiError(
            {
                code: "VALIDATION_ERROR",
                message: "guestToken is required for guest cart creation",
            },
            400,
        );
    }

    try {
        const existing = await getActiveCartByOwner({
            userId: context.userId,
            guestToken,
        });

        if (existing) {
            return apiSuccess(existing);
        }

        const created = await createActiveCart({
            userId: context.userId,
            guestToken,
        });

        return apiSuccess(created, { status: 201 });
    } catch (error) {
        return apiError(
            {
                code: "INTERNAL_ERROR",
                message: error instanceof Error ? error.message : "Failed to create cart",
            },
            500,
        );
    }
}
