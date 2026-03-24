// ─── Product Domain Types ─────────────────────────────────────────────────────

export interface ProductImage {
    id: string;
    url: string;
    alt: string;
}

export interface ProductVariant {
    id: string;
    name: string;
    value: string;
    inStock: boolean;
}

export type ProductCategory =
    | "electronics"
    | "fashion"
    | "home"
    | "beauty"
    | "sports"
    | "gaming";

export interface Product {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    price: number;
    compareAtPrice?: number;
    images: ProductImage[];
    category: ProductCategory;
    tags: string[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
    variants?: ProductVariant[];
    isFeatured?: boolean;
    isNew?: boolean;
    sku: string;
    slug: string;
}

export interface ProductFilters {
    categories: ProductCategory[];
    priceMin: number;
    priceMax: number;
    sortBy: "price-asc" | "price-desc" | "newest" | "rating" | "popular";
    inStockOnly: boolean;
    searchQuery: string;
}
