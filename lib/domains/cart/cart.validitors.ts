import { z } from "zod";

export const createCartSchema = z
    .object({
        guestToken: z.string().trim().min(8).max(5000).optional(),
    })
    .default({});

export const addCartItemSchema = z.object({
    cartId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.coerce.number().int().min(1).max(99),
});

export const mergeCartSchema = z.object({
    sourceGuestToken: z.string().trim().min(8).max(5000),
});

export type CreateCartInput = z.infer<typeof createCartSchema>;
