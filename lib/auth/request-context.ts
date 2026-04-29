import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface RequestContext {
    userId: string | null;
    isAdmin: boolean;
    guestToken: string | null;
}

function getBearerToken(request: Request): string | null {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    return authHeader.slice("Bearer ".length);
}

export async function resolveRequestContext(request: Request): Promise<RequestContext> {
    const token = getBearerToken(request);
    const guestToken = request.headers.get("x-guest-token");

    if (!token) {
        return {
            userId: null,
            isAdmin: false,
            guestToken,
        };
    }

    const supabase = createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
        return {
            userId: null,
            isAdmin: false,
            guestToken,
        };
    }

    const adminClient = createSupabaseAdminClient();
    const { data: profile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    return {
        userId: user.id,
        isAdmin: profile?.role === "admin",
        guestToken,
    };
}
