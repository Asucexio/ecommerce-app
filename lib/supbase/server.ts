import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/config/env";
import type { Database } from "@/lib/types/database.ts";

export function createSupabaseServerClient() {
    const { url, anonKey } = getSupabaseConfig();

    return createClient<Database>(url, anonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}
