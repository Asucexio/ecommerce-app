import type { RequestContext } from "@/lib/auth/request-context";
import { apiError } from "@/lib/shared/http/response";

export function requireUser(context: RequestContext) {
    if (!context.userId) {
        return apiError(
            {
                code: "UNAUTHORIZED",
                message: "Authentication is required for this endpoint.",
            },
            401,
        );
    }

    return null;
}

export function requireAdmin(context: RequestContext) {
    if (!context.userId) {
        return apiError(
            {
                code: "UNAUTHORIZED",
                message: "Authentication is required for admin endpoints.",
            },
            401,
        );
    }

    if (!context.isAdmin) {
        return apiError(
            {
                code: "FORBIDDEN",
                message: "Admin role is required for this endpoint.",
            },
            403,
        );
    }

    return null;
}
