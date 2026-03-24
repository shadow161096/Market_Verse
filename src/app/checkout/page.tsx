"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store";
import { formatPrice } from "@/lib/utils/formatPrice";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/animations";
import { Check, MapPin, CreditCard, Eye, Package } from "lucide-react";

type CheckoutStep = "address" | "payment" | "review" | "confirm";

const STEPS: { key: CheckoutStep; label: string; icon: typeof Check }[] = [
    { key: "address", label: "Address", icon: MapPin },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "review", label: "Review", icon: Eye },
    { key: "confirm", label: "Confirm", icon: Package },
];

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useStore();
    const [step, setStep] = useState<CheckoutStep>("address");
    const [isLoading, setIsLoading] = useState(false);
    const total = subtotal();

    const currentStepIdx = STEPS.findIndex((s) => s.key === step);

    const handleNext = async () => {
        const steps: CheckoutStep[] = ["address", "payment", "review", "confirm"];
        const next = steps[currentStepIdx + 1];
        if (next) {
            if (next === "confirm") {
                setIsLoading(true);
                await new Promise((r) => setTimeout(r, 1500)); // Simulate API
                setIsLoading(false);
                clearCart();
            }
            setStep(next);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-6">
                {/* Step indicators */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const isDone = i < currentStepIdx;
                        const isActive = i === currentStepIdx;
                        return (
                            <div key={s.key} className="flex items-center gap-3">
                                <div className="flex flex-col items-center gap-1.5">
                                    <motion.div
                                        animate={{
                                            scale: isActive ? 1.1 : 1,
                                            background: isDone
                                                ? "rgba(168,85,247,0.3)"
                                                : isActive
                                                    ? "rgba(168,85,247,0.2)"
                                                    : "rgba(255,255,255,0.05)",
                                        }}
                                        className="w-10 h-10 rounded-xl border flex items-center justify-center"
                                        style={{
                                            borderColor: isDone || isActive ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {isDone ? (
                                            <Check className="w-4 h-4 text-purple-400" />
                                        ) : (
                                            <Icon className={`w-4 h-4 ${isActive ? "text-purple-300" : "text-slate-600"}`} />
                                        )}
                                    </motion.div>
                                    <span
                                        className={`text-xs font-medium ${isActive ? "text-white" : isDone ? "text-purple-400" : "text-slate-600"
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`h-px w-12 transition-colors duration-500 ${i < currentStepIdx ? "bg-purple-500/60" : "bg-white/10"
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === "address" && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GlassPanel rounded="2xl" className="p-8 flex flex-col gap-6">
                                        <h2 className="font-display font-bold text-white text-xl">Shipping Address</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["First Name", "Last Name", "Email", "Phone", "Address Line 1", "City", "State", "ZIP Code"].map((field) => (
                                                <div key={field} className={field.includes("Address") || field.includes("Email") ? "col-span-2" : ""}>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">{field}</label>
                                                    <input
                                                        type={field === "Email" ? "email" : field === "Phone" ? "tel" : "text"}
                                                        placeholder={field}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-600 focus:border-purple-500/60 transition-colors"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="primary" size="lg" onClick={handleNext} className="self-end">
                                            Continue to Payment
                                        </Button>
                                    </GlassPanel>
                                </motion.div>
                            )}

                            {step === "payment" && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GlassPanel rounded="2xl" className="p-8 flex flex-col gap-6">
                                        <h2 className="font-display font-bold text-white text-xl">Payment Details</h2>
                                        <GlassPanel variant="dark" rounded="xl" className="p-5 flex flex-col gap-4">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Card Number</p>
                                            <input
                                                type="text"
                                                placeholder="4242 4242 4242 4242"
                                                className="w-full bg-transparent text-white text-lg font-mono outline-none placeholder-slate-700"
                                            />
                                        </GlassPanel>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["Expiry (MM/YY)", "CVV"].map((f) => (
                                                <div key={f}>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">{f}</label>
                                                    <input
                                                        type="text"
                                                        placeholder={f === "Expiry (MM/YY)" ? "12/27" : "•••"}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-600 focus:border-purple-500/60 transition-colors"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="ghost" size="lg" onClick={() => setStep("address")}>Back</Button>
                                            <Button variant="primary" size="lg" onClick={handleNext} className="flex-1">
                                                Review Order
                                            </Button>
                                        </div>
                                    </GlassPanel>
                                </motion.div>
                            )}

                            {step === "review" && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GlassPanel rounded="2xl" className="p-8 flex flex-col gap-6">
                                        <h2 className="font-display font-bold text-white text-xl">Review Order</h2>
                                        <div className="flex flex-col gap-3">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                                                    <span className="text-sm text-white flex-1">{item.name}</span>
                                                    <span className="text-xs text-slate-500">×{item.quantity}</span>
                                                    <span className="text-sm font-medium text-white">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button variant="ghost" size="lg" onClick={() => setStep("payment")}>Back</Button>
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="flex-1"
                                                isLoading={isLoading}
                                                onClick={handleNext}
                                            >
                                                Place Order — {formatPrice(total)}
                                            </Button>
                                        </div>
                                    </GlassPanel>
                                </motion.div>
                            )}

                            {step === "confirm" && (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                                >
                                    <GlassPanel
                                        rounded="2xl"
                                        glow="purple"
                                        className="p-12 flex flex-col items-center gap-6 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center"
                                        >
                                            <Check className="w-10 h-10 text-purple-400" />
                                        </motion.div>
                                        <div>
                                            <h2 className="text-2xl font-display font-bold text-white">Order Confirmed!</h2>
                                            <p className="text-slate-400 mt-2">
                                                Your order has been placed. You&apos;ll receive a confirmation email shortly.
                                            </p>
                                        </div>
                                        <Button variant="primary" size="lg" onClick={() => window.location.href = "/dashboard"}>
                                            Track Your Order
                                        </Button>
                                    </GlassPanel>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    {step !== "confirm" && (
                        <div>
                            <GlassPanel rounded="2xl" className="p-6 flex flex-col gap-4 sticky top-24">
                                <h3 className="font-display font-semibold text-white">Order Summary</h3>
                                <div className="flex flex-col gap-3">
                                    {items.slice(0, 4).map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 truncate">{item.name} ×{item.quantity}</span>
                                            <span className="text-white shrink-0 ml-2">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/8 pt-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-white">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Shipping</span>
                                        <span className="text-[#10b981]">Free</span>
                                    </div>
                                    <div className="flex items-center justify-between font-bold pt-2 border-t border-white/8 mt-1">
                                        <span className="text-white">Total</span>
                                        <span className="text-white text-lg">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
