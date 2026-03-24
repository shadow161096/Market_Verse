"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, LayoutGrid } from "lucide-react";
import { useStore } from "@/store";
import { ProductGrid } from "@/components/ecommerce/ProductGrid";
import { FilterPanel } from "@/components/ecommerce/FilterPanel";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { fadeDown } from "@/lib/animations";
import type { Product } from "@/types/product";

interface ProductsClientProps {
    initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { filters, openSearch } = useStore();

    // Client-side filtering on top of already fetched server results 
    // (or we could fetch again on filter change, but for now we keep the store logic)
    const filteredProducts = useMemo<Product[]>(() => {
        let results = [...initialProducts];

        // Apply client filters if they exist
        if (filters.categories.length > 0) {
            results = results.filter((p) =>
                filters.categories.includes(p.category)
            );
        }

        // Search query
        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            results = results.filter((p) =>
                p.name.toLowerCase().includes(q)
            );
        }

        return results;
    }, [filters, initialProducts]);

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    variants={fadeDown}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                        All Products
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {filteredProducts.length} results found
                    </p>
                </motion.div>

                <GlassPanel rounded="xl" className="mb-8">
                    <button
                        onClick={openSearch}
                        className="flex items-center gap-3 px-5 py-4 w-full text-left"
                    >
                        <Search className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-500">
                            Search products… (⌘K)
                        </span>
                    </button>
                </GlassPanel>

                <div className="flex gap-8">
                    <aside className="hidden lg:block w-64 shrink-0">
                        <FilterPanel />
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-500">
                                    {filteredProducts.length} products
                                </span>
                            </div>
                        </div>

                        <ProductGrid products={filteredProducts} columns={3} />
                    </div>
                </div>
            </div>
        </div>
    );
}
