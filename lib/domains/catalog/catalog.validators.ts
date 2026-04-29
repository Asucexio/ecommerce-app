import { z } from "zod";

export const createProductSchema = z.object({
    slug: z.string().trim().min(2).max(120),
    name: z.string().trim().min(2).max(200),
    description: z.string().trim().max(5000).optional().nullable(),
    image_url: z.string().url().optional().nullable(),
    price_cents: z.coerce.number().int().min(0),
    currency: z.string().trim().length(3).default("USD"),
    active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();
