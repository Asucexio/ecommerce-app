export type CartDto = {
    id: string;
    user_id: string | null;
    guest_token: string | null;
    status: "active" | "converted" | "abandoned";
};

export type CartItemDto = {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    unit_price_cents: number;
};
