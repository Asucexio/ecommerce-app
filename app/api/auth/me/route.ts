import { resolveRequestContext } from "@/lib/auth/request-context";
import { apiSuccess } from "@/lib/shared/http/response";

export async function GET(request: Request) {
    const context = await resolveRequestContext(request);

    return apiSuccess({
        userId: context.userId,
        isAdmin: context.isAdmin,
        role: context.isAdmin ? "admin" : context.userId ? "customer" : "guest",
    });
}