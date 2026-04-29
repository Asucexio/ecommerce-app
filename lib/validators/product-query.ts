import { z } from "zod";

export const productListQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    active: z
        .enum(["true", "false", "all"])
        .default("true")
        .transform((value) => (value === "all" ? undefined : value === "true")),
    search: z.string().trim().max(100).optional(),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;