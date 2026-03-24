"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Tag, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils/formatPrice";
import { backdropVariants, scaleIn } from "@/lib/animations";
import type { Product } from "@/types/product";

export function SearchPalette() {
    const { isSearchOpen, closeSearch } = useStore();
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const results: Product[] = query.trim()
        ? MOCK_PRODUCTS.filter(
            (p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.tags.some((t) => t.includes(query.toLowerCase())) ||
                p.category.includes(query.toLowerCase())
        ).slice(0, 6)
        : MOCK_PRODUCTS.slice(0, 4);

    // Focus on open; close on Escape
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSearch();
            // Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                isSearchOpen ? closeSearch() : useStore.getState().openSearch();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isSearchOpen, closeSearch]);

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <>
                    <motion.div
                        key="search-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[80]"
                        onClick={closeSearch}
                    />
                    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-20 px-4">
                        <motion.div
                            key="search-modal"
                            variants={scaleIn}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                            className="w-full max-w-xl"
                        >
                            <GlassPanel
                                variant="strong"
                                glow="purple"
                                rounded="2xl"
                                className="overflow-hidden"
                            >
                                {/* Input */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
                                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                                    <input
                                        ref={inputRef}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search products, categories, tags…"
                                        className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery("")}
                                            className="text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-500 select-none">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-96 overflow-y-auto">
                                    {results.length > 0 ? (
                                        <ul className="py-2">
                                            {!query && (
                                                <li className="px-5 py-2">
                                                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                                                        Popular
                                                    </span>
                                                </li>
                                            )}
                                            {results.map((product) => (
                                                <li key={product.id}>
                                                    <Link
                                                        href={`/products/${product.id}`}
                                                        onClick={closeSearch}
                                                        className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors group"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/8 overflow-hidden shrink-0 relative">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={product.images[0]?.url}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {product.name}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <Badge variant="purple" className="text-[10px]">
                                                                    <Tag className="w-2.5 h-2.5" />
                                                                    {product.category}
                                                                </Badge>
                                                                <span className="text-xs text-slate-500">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 py-10 text-center">
                                            <Zap className="w-8 h-8 text-slate-600" />
                                            <p className="text-slate-500 text-sm">No results for &ldquo;{query}&rdquo;</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-3 border-t border-white/8 flex gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">↑↓</kbd>
                                        Navigate
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">↵</kbd>
                                        Open
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">ESC</kbd>
                                        Close
                                    </div>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
