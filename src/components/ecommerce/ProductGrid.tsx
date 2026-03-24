"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { staggerContainer } from "@/lib/animations";
import type { Product } from "@/types/product";

interface ProductGridProps {
    products: Product[];
    columns?: 2 | 3 | 4;
}

const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                </div>
                <p className="text-white font-medium">No products found</p>
                <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={`grid ${columnClasses[columns]} gap-5`}
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </motion.div>
    );
}
