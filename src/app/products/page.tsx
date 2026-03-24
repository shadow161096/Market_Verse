import { api } from "@/lib/api";
import { ProductsClient } from "@/components/ecommerce/ProductsClient";
import type { Product } from "@/types/product";

// This is now a Server Component
export default async function ProductsPage() {
    // Fetch products directly from the API (on the server)
    let products: Product[] = [];

    try {
        // In production, use the absolute URL for the backend
        const data = await api.products.list(1, 100);

        // Transform Prisma data to Product type if needed 
        // (for now assuming backend returns it correctly or we handle nested objects)
        products = data.map((p: any) => ({
            ...p,
            category: p.category?.name || 'electronics',
            inStock: p.stockQuantity > 0,
            price: Number(p.price),
            images: p.images || [
                { id: '1', url: `https://picsum.photos/seed/${p.id}/400/500`, alt: p.name }
            ],
            tags: p.tags || []
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }

    return <ProductsClient initialProducts={products} />;
}
