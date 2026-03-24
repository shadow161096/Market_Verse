"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { useStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { ProductCategory } from "@/types/product";
import { cn } from "@/lib/utils/cn";

const CATEGORIES: { value: ProductCategory; label: string; emoji: string }[] = [
    { value: "electronics", label: "Electronics", emoji: "⚡" },
    { value: "fashion", label: "Fashion", emoji: "👕" },
    { value: "gaming", label: "Gaming", emoji: "🎮" },
    { value: "home", label: "Home", emoji: "🏠" },
    { value: "beauty", label: "Beauty", emoji: "✨" },
    { value: "sports", label: "Sports", emoji: "🏃" },
];

const SORT_OPTIONS = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Best Rated" },
] as const;

export function FilterPanel() {
    const { filters, toggleCategory, setFilter, resetFilters } = useStore();

    return (
        <GlassPanel rounded="2xl" className="p-6 flex flex-col gap-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                    <span className="font-display font-semibold text-white text-sm">
                        Filters
                    </span>
                </div>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                </button>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                </span>
                <div className="flex flex-col gap-1.5">
                    {CATEGORIES.map((cat) => {
                        const isActive = filters.categories.includes(cat.value);
                        return (
                            <motion.button
                                key={cat.value}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleCategory(cat.value)}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left w-full",
                                    isActive
                                        ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <span className="text-base">{cat.emoji}</span>
                                {cat.label}
                                {isActive && (
                                    <X className="w-3 h-3 ml-auto text-purple-400" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price Range
                </span>
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <input
                            type="number"
                            min={0}
                            max={filters.priceMax}
                            value={filters.priceMin}
                            onChange={(e) => setFilter("priceMin", Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/60 transition-colors"
                            placeholder="Min"
                        />
                    </div>
                    <span className="text-slate-600">—</span>
                    <div className="flex-1">
                        <input
                            type="number"
                            min={filters.priceMin}
                            value={filters.priceMax}
                            onChange={(e) => setFilter("priceMax", Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/60 transition-colors"
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Sort By
                </span>
                <div className="flex flex-col gap-1">
                    {SORT_OPTIONS.map((opt) => {
                        const isActive = filters.sortBy === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setFilter("sortBy", opt.value)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left w-full",
                                    isActive
                                        ? "bg-cyan-500/15 border border-cyan-500/30 text-[#00f5ff]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {opt.label}
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* In Stock Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-400">In Stock Only</span>
                <div
                    onClick={() => setFilter("inStockOnly", !filters.inStockOnly)}
                    className={cn(
                        "relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer",
                        filters.inStockOnly ? "bg-purple-500" : "bg-white/10"
                    )}
                >
                    <motion.div
                        animate={{ x: filters.inStockOnly ? 20 : 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                </div>
            </label>

            {/* Apply */}
            <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                    toast.success("Filters applied successfully!", {
                        style: {
                            background: "rgba(15, 23, 42, 0.9)",
                            color: "#fff",
                            border: "1px solid rgba(168, 85, 247, 0.3)",
                        },
                        iconTheme: {
                            primary: "#a855f7",
                            secondary: "#fff",
                        },
                    });
                }}
            >
                Apply Filters
            </Button>
        </GlassPanel>
    );
}
