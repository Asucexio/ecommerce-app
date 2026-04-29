import { productListQuerySchema } from "@/lib/validators/product-query";
import { listProducts } from "@/lib/repositories/products";

export async function GET(request: Request) {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsedQuery = productListQuerySchema.safeParse(rawQuery);

    if (!parsedQuery.success) {
        return Response.json(
            {
                error: "Invalid query parameters",
                details: parsedQuery.error.flatten(),
            },
            { status: 400 },
        );
    }

    try {
        const products = await listProducts(parsedQuery.data);
        return Response.json({ products });
    } catch (error) {
        return Response.json(
            {
                error: "Failed to load products",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
