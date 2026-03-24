"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    Plus,
    Search,
    Edit,
    Trash2,
    Settings,
    Zap,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HolographicText } from "@/components/ui/HolographicText";
import { formatPrice } from "@/lib/utils/formatPrice";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/animations";

interface AdminClientProps {
    initialStats: any;
}

export function AdminClient({ initialStats }: AdminClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const STATS = [
        { icon: TrendingUp, label: "Revenue (MTD)", value: formatPrice(initialStats.revenue || 0), delta: initialStats.revenueDelta || '0%', color: "text-[#00f5ff]", bg: "bg-[#00f5ff]/10 border-[#00f5ff]/20" },
        { icon: ShoppingCart, label: "Orders", value: (initialStats.orders || 0).toString(), delta: initialStats.ordersDelta || '0', color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
        { icon: Users, label: "Customers", value: (initialStats.customers || 0).toString(), delta: initialStats.customersDelta || '0%', color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
        { icon: Package, label: "Products", value: (initialStats.products || 0).toString(), delta: "Live", color: "text-[#10b981]", bg: "bg-[#10b981]/10 border-[#10b981]/20" },
    ];

    const ADMIN_NAV = [
        { icon: BarChart3, label: "Overview", active: true },
        { icon: Package, label: "Products" },
        { icon: ShoppingCart, label: "Orders" },
        { icon: Users, label: "Customers" },
        { icon: Settings, label: "Settings" },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-8"
                >
                    {/* Sidebar */}
                    <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-2">
                        <GlassPanel rounded="2xl" className="p-4 flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white font-display">MarketVerse</p>
                                <p className="text-[10px] text-slate-500">Admin Console</p>
                            </div>
                        </GlassPanel>
                        {ADMIN_NAV.map(({ icon: Icon, label, active }) => (
                            <button key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-all ${active ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </aside>

                    <div className="flex-1 min-w-0 flex flex-col gap-6">
                        <motion.div variants={fadeUp} className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <h1 className="text-2xl font-display font-bold text-white">
                                    Admin <HolographicText animate={false}>Console</HolographicText>
                                </h1>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {STATS.map((stat) => (
                                <motion.div key={stat.label} variants={staggerItem}>
                                    <GlassPanel rounded="2xl" className="p-5">
                                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-4 ${stat.bg}`}>
                                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        </div>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-xs text-slate-500">{stat.label}</p>
                                    </GlassPanel>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
