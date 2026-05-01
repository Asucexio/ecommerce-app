"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/hooks/use-cart";

type ProductDto = {
    id: string;
    name: string;
    slug: string;
    price_cents: number;
    description: string | null;
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const { cart, initCart, addItem } = useCart();
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadProduct() {
            const response = await fetch(`/api/catalog/products?search=${encodeURIComponent(params.slug)}&limit=12`);
            const json = (await response.json()) as { data?: { items?: ProductDto[] } };
            const matched = json?.data?.items?.find((item) => item.slug === params.slug) ?? null;
            setProduct(matched);
        }

        void initCart();
        void loadProduct();
    }, [initCart, params.slug]);

    async function onAddToCart() {
        if (!cart?.id || !product?.id) return;

        try {
            await addItem({ cartId: cart.id, productId: product.id, quantity: 1 });
            setMessage("Added to cart");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to add item");
        }
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-2 text-2xl font-semibold">{product?.name ?? `Product: ${params.slug}`}</h1>
            <p className="mb-4 text-sm text-gray-600">{product?.description ?? "Loading product details..."}</p>
            <p className="mb-4">Price: {product ? `$${(product.price_cents / 100).toFixed(2)}` : "-"}</p>

            <button className="rounded border px-3 py-2" onClick={() => void onAddToCart()} disabled={!cart?.id || !product?.id}>
                Add to cart
            </button>
            {message && <p className="mt-3">{message}</p>}
        </main>
    );
}