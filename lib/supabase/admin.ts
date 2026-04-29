import { createClient } from "@supabase/supabase-js";

import { getServerConfig, getSupabaseConfig } from "@/lib/config/env";
import type { Database } from "@/lib/types/database.ts";

export function createSupabaseAdminClient() {
    const { url } = getSupabaseConfig();
    const { supabaseServiceRoleKey } = getServerConfig();

    return createClient<Database>(url, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}
