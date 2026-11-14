
export type VariantsDatabase = {
  public: {
    Tables: {
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string | null;
          color: string | null;
          color_code: string | null;
          sku: string | null;
          stock_quantity: number;
          price_override: number | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size?: string | null;
          color?: string | null;
          color_code?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          price_override?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: string | null;
          color?: string | null;
          color_code?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          price_override?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
