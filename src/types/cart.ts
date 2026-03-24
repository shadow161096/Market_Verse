// ─── Cart Domain Types ────────────────────────────────────────────────────────

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
    slug: string;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
}
