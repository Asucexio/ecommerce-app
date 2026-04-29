import { requireUser } from "@/lib/auth/guards";
import { resolveRequestContext } from "@/lib/auth/request-context";
import { createOrderSchema } from "@/lib/domains/checkout/checkout.validators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/shared/http/response";

export async function POST(request: Request) {
    const context = await resolveRequestContext(request);
    const authError = requireUser(context);

    if (authError) return authError;

    const body = await request.json().catch(() => null);
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
        return apiError({ code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const admin = createSupabaseAdminClient();
    const { data: cartItems, error: cartItemsError } = await admin
        .from("cart_items")
        .select("*")
        .eq("cart_id", parsed.data.cartId);

    if (cartItemsError) return apiError({ code: "INTERNAL_ERROR", message: cartItemsError.message }, 500);
    if (!cartItems.length) return apiError({ code: "VALIDATION_ERROR", message: "Cart is empty" }, 400);

    const productIds = Array.from(new Set(cartItems.map((item) => item.product_id)));
    const { data: products, error: productsError } = await admin
        .from("products")
        .select("id, name, slug")
        .in("id", productIds);

    if (productsError) {
        return apiError({ code: "INTERNAL_ERROR", message: productsError.message }, 500);
    }

    const productMap = new Map((products ?? []).map((product) => [product.id, product]));
    const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);

    const { data: order, error: orderError } = await admin
        .from("orders")
        .insert({
            user_id: context.userId!,
            status: "draft",
            payment_status: "requires_payment_method",
            currency: "USD",
            subtotal_cents: subtotal,
            shipping_cents: 0,
            tax_cents: 0,
            total_cents: subtotal,
        })
        .select("*")
        .single();

    if (orderError) return apiError({ code: "INTERNAL_ERROR", message: orderError.message }, 500);

    const orderItemsPayload = cartItems.map((item) => {
        const product = productMap.get(item.product_id);

        return {
            order_id: order.id,
            product_id: item.product_id,
            product_name: product?.name ?? "Product",
            product_slug: product?.slug ?? null,
            quantity: item.quantity,
            unit_price_cents: item.unit_price_cents,
            line_total_cents: item.unit_price_cents * item.quantity,
        };
    });

    const { error: orderItemsError } = await admin.from("order_items").insert(orderItemsPayload);

    if (orderItemsError) return apiError({ code: "INTERNAL_ERROR", message: orderItemsError.message }, 500);

    return apiSuccess({ orderId: order.id, status: order.status }, { status: 201 });
}
