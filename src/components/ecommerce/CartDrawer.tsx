"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { formatPrice } from "@/lib/utils/formatPrice";
import { toast } from "react-hot-toast";
import { backdropVariants, slideInRight, staggerContainer, staggerItem } from "@/lib/animations";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
        useStore();

    const total = subtotal();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="cart-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="cart-drawer"
                        variants={slideInRight}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-70 flex flex-col"
                        style={{ zIndex: 70 }}
                    >
                        <GlassPanel
                            variant="dark"
                            className="h-full flex flex-col border-l border-white/10 rounded-none"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                        <ShoppingBag className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold text-white text-sm">
                                            Cart
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            {items.length} {items.length === 1 ? "item" : "items"}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Items */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center justify-center h-full gap-4 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Your cart is empty</p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                Add items to get started
                                            </p>
                                        </div>
                                        <Button variant="primary" size="sm" onClick={closeCart}>
                                            Browse Products
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.ul
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex flex-col gap-4"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {items.map((item) => (
                                                <motion.li
                                                    key={item.id}
                                                    variants={staggerItem}
                                                    layout
                                                    exit={{
                                                        opacity: 0,
                                                        x: 60,
                                                        transition: { duration: 0.25 },
                                                    }}
                                                >
                                                    <GlassPanel rounded="xl" className="p-3 flex gap-3">
                                                        {/* Image */}
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 relative">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {item.name}
                                                            </p>
                                                            {item.variant && (
                                                                <p className="text-xs text-slate-500 mt-0.5">
                                                                    {item.variant}
                                                                </p>
                                                            )}
                                                            <p className="text-sm font-bold text-purple-400 mt-1">
                                                                {formatPrice(item.price)}
                                                            </p>
                                                        </div>

                                                        {/* Quantity & Remove */}
                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-slate-600 hover:text-red-400 transition-colors p-1"
                                                                aria-label={`Remove ${item.name}`}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>

                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(item.id, item.quantity - 1)
                                                                    }
                                                                    className="w-6 h-6 rounded-md bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus className="w-3 h-3 text-slate-300" />
                                                                </button>
                                                                <span className="text-sm font-medium text-white w-4 text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(item.id, item.quantity + 1)
                                                                    }
                                                                    className="w-6 h-6 rounded-md bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus className="w-3 h-3 text-slate-300" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </GlassPanel>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </motion.ul>
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="px-6 py-5 border-t border-white/8 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm">Subtotal</span>
                                        <motion.span
                                            key={total}
                                            initial={{ scale: 1.1, color: "#a855f7" }}
                                            animate={{ scale: 1, color: "#fff" }}
                                            className="font-bold text-white text-lg"
                                        >
                                            {formatPrice(total)}
                                        </motion.span>
                                    </div>
                                    <p className="text-xs text-slate-600 text-center">
                                        Taxes and shipping calculated at checkout
                                    </p>
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toast("Checkout UI is currently in development.", {
                                                icon: '🚧',
                                                style: {
                                                    background: "rgba(15, 23, 42, 0.9)",
                                                    color: "#fff",
                                                    border: "1px solid rgba(234, 179, 8, 0.3)",
                                                }
                                            });
                                            closeCart();
                                        }}
                                    >
                                        <Button variant="primary" className="w-full" size="lg">
                                            Checkout
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-slate-500"
                                        size="sm"
                                        onClick={closeCart}
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            )}
                        </GlassPanel>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
