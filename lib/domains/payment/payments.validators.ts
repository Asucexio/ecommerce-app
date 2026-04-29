import { z } from "zod";

export const updateOrderStatusSchema = z.object({
    status: z.enum(["draft", "pending_payment", "paid", "failed", "canceled"]),
});

export const inventoryAdjustSchema = z.object({
    productId: z.string().uuid(),
    price_cents: z.coerce.number().int().min(0),
});
