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
            products: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    image_url: string | null;
                    price_cents: number;
                    currency: string;
                    active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    image_url?: string | null;
                    price_cents: number;
                    currency?: string;
                    active?: boolean;
                    created_at?: string;
                };
                Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
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