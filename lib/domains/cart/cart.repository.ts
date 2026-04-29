import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Cart, CartItem } from "@/lib/types/database";

interface CartWithItems {
    cart: Cart;
    items: CartItem[];
}

export async function getActiveCartByOwner(params: {
    userId?: string | null;
    guestToken?: string | null;
}): Promise<CartWithItems | null> {
    const admin = createSupabaseAdminClient();

    let query = admin.from("carts").select("*").eq("status", "active").limit(1);

    if (params.userId) {
        query = query.eq("user_id", params.userId);
    } else if (params.guestToken) {
        query = query.eq("guest_token", params.guestToken);
    } else {
        return null;
    }

    const { data: cart, error } = await query.maybeSingle();

    if (error) {
        throw new Error(`Failed to load cart: ${error.message}`);
    }

    if (!cart) {
        return null;
    }

    const { data: items, error: itemsError } = await admin
        .from("cart_items")
        .select("*")
        .eq("cart_id", cart.id)
        .order("created_at", { ascending: true });

    if (itemsError) {
        throw new Error(`Failed to load cart items: ${itemsError.message}`);
    }

    return {
        cart,
        items,
    };
}

export async function createActiveCart(params: {
    userId?: string | null;
    guestToken?: string | null;
}): Promise<CartWithItems> {
    const admin = createSupabaseAdminClient();
    const payload = {
        user_id: params.userId ?? null,
        guest_token: params.userId ? null : (params.guestToken ?? null),
        status: "active" as const,
    };

    const { data: cart, error } = await admin.from("carts").insert(payload).select("*").single();

    if (error) {
        throw new Error(`Failed to create cart: ${error.message}`);
    }

    return {
        cart,
        items: [],
    };
}

export async function upsertCartItem(input: {
    cartId: string;
    productId: string;
    quantity: number;
}) {
    const admin = createSupabaseAdminClient();

    const { data: product, error: productError } = await admin
        .from("products")
        .select("price_cents, active")
        .eq("id", input.productId)
        .single();

    if (productError || !product || !product.active) {
        throw new Error("Product not available");
    }

    const { data, error } = await admin
        .from("cart_items")
        .upsert(
            {
                cart_id: input.cartId,
                product_id: input.productId,
                quantity: input.quantity,
                unit_price_cents: product.price_cents,
            },
            { onConflict: "cart_id,product_id" },
        )
        .select("*")
        .single();

    if (error) {
        throw new Error(`Failed to upsert cart item: ${error.message}`);
    }

    return data;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId)
        .select("*")
        .single();

    if (error) {
        throw new Error(`Failed to update cart item: ${error.message}`);
    }

    return data;
}

export async function deleteCartItem(itemId: string) {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("cart_items").delete().eq("id", itemId);

    if (error) {
        throw new Error(`Failed to delete cart item: ${error.message}`);
    }
}

export async function mergeGuestCartToUser(userId: string, sourceGuestToken: string) {
    const source = await getActiveCartByOwner({ guestToken: sourceGuestToken });

    if (!source) {
        return null;
    }

    let target = await getActiveCartByOwner({ userId });

    if (!target) {
        target = await createActiveCart({ userId });
    }

    for (const item of source.items) {
        await upsertCartItem({
            cartId: target.cart.id,
            productId: item.product_id,
            quantity: item.quantity,
        });
    }

    const admin = createSupabaseAdminClient();
    await admin.from("carts").update({ status: "converted" }).eq("id", source.cart.id);

    return getActiveCartByOwner({ userId });
}
