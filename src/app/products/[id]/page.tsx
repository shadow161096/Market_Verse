"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    ShoppingCart,
    Heart,
    Star,
    ChevronLeft,
    Plus,
    Minus,
    Check,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { useStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProductGrid } from "@/components/ecommerce/ProductGrid";
import { formatPrice, calcDiscount } from "@/lib/utils/formatPrice";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
    const { addItem } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(
        product?.variants?.[0]?.value ?? ""
    );
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [added, setAdded] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    if (!product) notFound();

    const discount = product.compareAtPrice
        ? calcDiscount(product.compareAtPrice, product.price)
        : null;

    const relatedProducts = MOCK_PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4);

    const handleAddToCart = () => {
        addItem({
            id: `${product.id}-${selectedVariant}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0]?.url ?? "",
            slug: product.slug,
            variant: selectedVariant || undefined,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-white truncate max-w-[200px]">{product.name}</span>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                    {/* Images */}
                    <motion.div variants={staggerItem} className="flex flex-col gap-4">
                        <GlassPanel rounded="2xl" className="aspect-square relative overflow-hidden">
                            <Image
                                src={product.images[selectedImageIdx]?.url ?? ""}
                                alt={product.images[selectedImageIdx]?.alt ?? product.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {product.isNew && (
                                <div className="absolute top-4 left-4">
                                    <Badge variant="neon">New Arrival</Badge>
                                </div>
                            )}
                        </GlassPanel>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageIdx(idx)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${idx === selectedImageIdx
                                                ? "border-purple-500"
                                                : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details */}
                    <motion.div variants={staggerItem} className="flex flex-col gap-6">
                        {/* Category + Rating */}
                        <div className="flex items-center justify-between gap-4">
                            <Badge variant="purple" className="capitalize">{product.category}</Badge>
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "fill-slate-700 text-slate-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-400">
                                    {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                                </span>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-slate-400 mt-3 leading-relaxed">
                                {product.longDescription ?? product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-white">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <>
                                    <span className="text-lg text-slate-500 line-through">
                                        {formatPrice(product.compareAtPrice)}
                                    </span>
                                    <Badge variant="success">Save {discount}%</Badge>
                                </>
                            )}
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-2.5">
                                    {product.variants[0].name}:{" "}
                                    <span className="text-white">{selectedVariant}</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v.value)}
                                            disabled={!v.inStock}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${selectedVariant === v.value
                                                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                                    : v.inStock
                                                        ? "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                                                        : "border-white/5 text-slate-600 cursor-not-allowed line-through"
                                                }`}
                                        >
                                            {v.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-medium text-slate-400">Quantity</p>
                            <div className="flex items-center gap-3 glass rounded-xl px-3 py-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-slate-400 hover:text-white transition-colors"
                                    aria-label="Decrease"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-white font-medium w-6 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                    aria-label="Increase"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant={added ? "secondary" : "primary"}
                                size="lg"
                                className="flex-1"
                                disabled={!product.inStock}
                                onClick={handleAddToCart}
                                leftIcon={added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                            >
                                {added ? "Added to Cart!" : product.inStock ? "Add to Cart" : "Out of Stock"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setWishlisted((v) => !v)}
                                aria-label="Wishlist"
                                className="px-4"
                            >
                                <Heart
                                    className={`w-5 h-5 transition-colors ${wishlisted ? "fill-pink-400 text-pink-400" : "text-slate-400"
                                        }`}
                                />
                            </Button>
                        </div>

                        {/* SKU */}
                        <p className="text-xs text-slate-600">SKU: {product.sku}</p>
                    </motion.div>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={staggerContainer}
                            className="flex flex-col gap-8"
                        >
                            <motion.div variants={fadeUp} className="flex items-center justify-between">
                                <h2 className="text-2xl font-display font-bold text-white">
                                    Related Products
                                </h2>
                                <Link href="/products">
                                    <Button variant="ghost" size="sm" rightIcon={<ChevronLeft className="w-4 h-4 rotate-180" />}>
                                        See all
                                    </Button>
                                </Link>
                            </motion.div>
                            <ProductGrid products={relatedProducts} columns={4} />
                        </motion.div>
                    </section>
                )}
            </div>
        </div>
    );
}
