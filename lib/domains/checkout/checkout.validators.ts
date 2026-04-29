import { z } from "zod";

export const checkoutValidateSchema = z.object({
    cartId: z.string().uuid(),
});

export const createOrderSchema = checkoutValidateSchema;

export const createPaymentIntentSchema = z.object({
    orderId: z.string().uuid(),
});
