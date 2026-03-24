"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart, Eye, Tag } from "lucide-react";
import { useStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { toast } from "react-hot-toast";
import { formatPrice, calcDiscount } from "@/lib/utils/formatPrice";
import { cardHover, staggerItem } from "@/lib/animations";
import type { Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useStore();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleAddToCart = () => {
        addItem({
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]?.url ?? "",
            slug: product.slug,
        });
    };

    const discount =
        product.compareAtPrice
            ? calcDiscount(product.compareAtPrice, product.price)
            : null;

    return (
        <motion.div
            variants={staggerItem}
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            <motion.div variants={cardHover} className="h-full">
                <GlassPanel
                    rounded="2xl"
                    className="h-full flex flex-col overflow-hidden group cursor-pointer"
                >
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-square bg-void-800">
                        {!isImageLoaded && (
                            <div className="absolute inset-0 skeleton" />
                        )}
                        <Image
                            src={product.images[0]?.url ?? ""}
                            alt={product.images[0]?.alt ?? product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isImageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            onLoad={() => setIsImageLoaded(true)}
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-void-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.isNew && <Badge variant="neon">New</Badge>}
                            {discount && (
                                <Badge variant="success">-{discount}%</Badge>
                            )}
                            {!product.inStock && <Badge variant="danger">Sold Out</Badge>}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsWishlisted((v) => {
                                        const newVal = !v;
                                        if (newVal) {
                                            toast.success(`${product.name} added to wishlist!`, {
                                                style: {
                                                    background: "rgba(15, 23, 42, 0.9)",
                                                    color: "#fff",
                                                    border: "1px solid rgba(236, 72, 153, 0.3)",
                                                },
                                                iconTheme: {
                                                    primary: "#ec4899",
                                                    secondary: "#fff",
                                                }
                                            });
                                        } else {
                                            toast.error(`${product.name} removed from wishlist.`, {
                                                style: {
                                                    background: "rgba(15, 23, 42, 0.9)",
                                                    color: "#fff",
                                                }
                                            });
                                        }
                                        return newVal;
                                    });
                                }}
                                className="w-8 h-8 rounded-lg glass flex items-center justify-center"
                                aria-label="Wishlist"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-pink-400 text-pink-400" : "text-slate-300"
                                        }`}
                                />
                            </motion.button>
                            <Link href={`/products/${product.id}`}>
                                <motion.span
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 rounded-lg glass flex items-center justify-center"
                                >
                                    <Eye className="w-4 h-4 text-slate-300" />
                                </motion.span>
                            </Link>
                        </div>

                        {/* Quick Add  */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                disabled={!product.inStock}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart();
                                }}
                                leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
                            >
                                {product.inStock ? "Quick Add" : "Sold Out"}
                            </Button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-slate-600" />
                            <span className="text-xs text-slate-500 capitalize">
                                {product.category}
                            </span>
                        </div>
                        <Link href={`/products/${product.id}`}>
                            <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-purple-300 transition-colors">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor(product.rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-slate-700 text-slate-700"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-slate-500">
                                ({product.reviewCount.toLocaleString()})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-auto pt-2">
                            <span className="text-base font-bold text-white">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <span className="text-xs text-slate-500 line-through">
                                    {formatPrice(product.compareAtPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                </GlassPanel>
            </motion.div>
        </motion.div>
    );
}
