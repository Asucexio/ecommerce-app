export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string | null;
                    full_name: string | null;
                    role: "customer" | "admin";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email?: string | null;
                    full_name?: string | null;
                    role?: "customer" | "admin";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
                Relationships: [];
            };
            products: {
                Row: {
                    id: string;
                    slug: string;
                    name: string;
                    description: string | null;
                    image_url: string | null;
                    price_cents: number;
                    currency: string;
                    active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    name: string;
                    description?: string | null;
                    image_url?: string | null;
                    price_cents: number;
                    currency?: string;
                    active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
                Relationships: [];
            };
            carts: {
                Row: {
                    id: string;
                    user_id: string | null;
                    guest_token: string | null;
                    status: "active" | "converted" | "abandoned";
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    guest_token?: string | null;
                    status?: "active" | "converted" | "abandoned";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["carts"]["Insert"]>;
                Relationships: [];
            };
            cart_items: {
                Row: {
                    id: string;
                    cart_id: string;
                    product_id: string;
                    quantity: number;
                    unit_price_cents: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    cart_id: string;
                    product_id: string;
                    quantity: number;
                    unit_price_cents: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
                Relationships: [];
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    status: "draft" | "pending_payment" | "paid" | "failed" | "canceled";
                    payment_status: "requires_payment_method" | "processing" | "succeeded" | "failed" | "canceled";
                    currency: string;
                    subtotal_cents: number;
                    shipping_cents: number;
                    tax_cents: number;
                    total_cents: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    status?: "draft" | "pending_payment" | "paid" | "failed" | "canceled";
                    payment_status?: "requires_payment_method" | "processing" | "succeeded" | "failed" | "canceled";
                    currency?: string;
                    subtotal_cents?: number;
                    shipping_cents?: number;
                    tax_cents?: number;
                    total_cents?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
                Relationships: [];
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    product_slug: string | null;
                    quantity: number;
                    unit_price_cents: number;
                    line_total_cents: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    product_id?: string | null;
                    product_name: string;
                    product_slug?: string | null;
                    quantity: number;
                    unit_price_cents: number;
                    line_total_cents: number;
                    created_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
                Relationships: [];
            };
            payments: {
                Row: {
                    id: string;
                    order_id: string;
                    provider: string;
                    payment_intent_id: string;
                    status: "requires_payment_method" | "processing" | "succeeded" | "failed" | "canceled";
                    amount_cents: number;
                    currency: string;
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    provider?: string;
                    payment_intent_id: string;
                    status: "requires_payment_method" | "processing" | "succeeded" | "failed" | "canceled";
                    amount_cents: number;
                    currency: string;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
                Relationships: [];
            };
            payment_events: {
                Row: {
                    id: string;
                    provider: string;
                    provider_event_id: string;
                    event_type: string;
                    payload: Json;
                    processed_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    provider?: string;
                    provider_event_id: string;
                    event_type: string;
                    payload: Json;
                    processed_at?: string | null;
                    created_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["payment_events"]["Insert"]>;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Cart = Database["public"]["Tables"]["carts"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
