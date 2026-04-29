import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/database";
import type { ProductListQuery } from "@/lib/validators/product-query";

export async function listProducts(filters: ProductListQuery): Promise<Product[]> {
    const supabase = createSupabaseServerClient();

    let query = supabase.from("products").select("*").order("created_at", { ascending: false }).limit(filters.limit);

    if (typeof filters.active === "boolean") {
        query = query.eq("active", filters.active);
    }

    if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data;
}
