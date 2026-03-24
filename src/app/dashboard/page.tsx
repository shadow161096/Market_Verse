"use client";

import { motion } from "framer-motion";
import {
    Package,
    Heart,
    User,
    BarChart3,
    Settings,
    ShoppingBag,
    TrendingUp,
    Clock,
    LogOut,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/animations";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const MOCK_ORDERS = [
    { id: "ORD-1042", date: "Feb 22, 2026", status: "shipped", total: 699.98, items: 2 },
    { id: "ORD-1041", date: "Feb 18, 2026", status: "delivered", total: 349.99, items: 1 },
    { id: "ORD-1040", date: "Feb 10, 2026", status: "delivered", total: 1589.0, items: 3 },
];

const STATUS_MAP: Record<string, { variant: "neon" | "success" | "warning" | "purple"; label: string }> = {
    shipped: { variant: "neon", label: "Shipped" },
    delivered: { variant: "success", label: "Delivered" },
    pending: { variant: "warning", label: "Pending" },
    processing: { variant: "purple", label: "Processing" },
};

const NAV_ITEMS = [
    { icon: Package, label: "Orders", active: true },
    { icon: Heart, label: "Wishlist" },
    { icon: Settings, label: "Settings" },
    { icon: User, label: "Profile" },
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("Orders");
    const [user, setUser] = useState<{ username: string; email: string; role: string; last_login: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchSession() {
            const res = await fetch("/api/auth/session");
            if (!res.ok) {
                router.push("/auth/login");
                return;
            }
            const data = await res.json();
            setUser(data.user);
        }
        fetchSession();
    }, [router]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/auth/login");
    };

    if (!user) {
        return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f5ff] font-mono tracking-widest text-sm animate-pulse">ESTABLISHING SECURE CONNECTION...</div>;
    }

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
                        {/* Avatar */}
                        <GlassPanel rounded="2xl" className="p-5 flex flex-col items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-white text-sm">{user.username}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <Badge variant="purple">{user.role}</Badge>

                            <button
                                onClick={handleLogout}
                                className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 border border-red-500/30 text-red-400 rounded-lg font-mono text-xs hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect
                            </button>
                        </GlassPanel>

                        {NAV_ITEMS.map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                onClick={() => setActiveTab(label)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-all duration-200 ${activeTab === label
                                    ? "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </aside>

                    {/* Main */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">
                        {/* Header */}
                        <motion.div variants={fadeUp}>
                            <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
                            <p className="text-slate-500 mt-1">Welcome back, {user.username} 👋</p>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: ShoppingBag, label: "Total Orders", value: "24", delta: "+3 this month", color: "text-purple-400" },
                                { icon: TrendingUp, label: "Total Spent", value: "$4,280", delta: "+$689 this month", color: "text-[#00f5ff]" },
                                { icon: Heart, label: "Wishlist", value: "12", delta: "3 on sale", color: "text-pink-400" },
                                { icon: Clock, label: "Pending", value: "1", delta: "Arriving Feb 28", color: "text-amber-400" },
                            ].map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div key={stat.label} variants={staggerItem}>
                                        <GlassPanel rounded="2xl" className="p-5 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500">{stat.label}</span>
                                                <Icon className={`w-4 h-4 ${stat.color}`} />
                                            </div>
                                            <span className="text-2xl font-bold font-display text-white">{stat.value}</span>
                                            <span className="text-xs text-slate-500">{stat.delta}</span>
                                        </GlassPanel>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Recent Orders - Only show on Orders tab */}
                        {activeTab === "Orders" && (
                            <motion.div variants={staggerItem}>
                                <GlassPanel rounded="2xl" className="overflow-hidden">
                                    <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-purple-400" />
                                            <h2 className="font-display font-semibold text-white">Recent Orders</h2>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                toast("Full order history coming soon.", {
                                                    icon: '⏳',
                                                    style: {
                                                        background: "rgba(15, 23, 42, 0.9)",
                                                        color: "#fff",
                                                        border: "1px solid rgba(168, 85, 247, 0.3)",
                                                    }
                                                });
                                            }}
                                        >View All</Button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    {["Order ID", "Date", "Items", "Total", "Status", ""].map((h) => (
                                                        <th
                                                            key={h}
                                                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {MOCK_ORDERS.map((order, i) => {
                                                    const statusInfo = STATUS_MAP[order.status] ?? { variant: "default", label: order.status };
                                                    return (
                                                        <motion.tr
                                                            key={order.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: i * 0.08 }}
                                                            className="border-b border-white/5 hover:bg-white/3 transition-colors"
                                                        >
                                                            <td className="px-6 py-4 text-sm font-mono text-purple-400">{order.id}</td>
                                                            <td className="px-6 py-4 text-sm text-slate-400">{order.date}</td>
                                                            <td className="px-6 py-4 text-sm text-slate-400">{order.items} items</td>
                                                            <td className="px-6 py-4 text-sm font-medium text-white">{formatPrice(order.total)}</td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        toast(`Viewing details for ${order.id}`, {
                                                                            icon: '📄',
                                                                            style: {
                                                                                background: "rgba(15, 23, 42, 0.9)",
                                                                                color: "#fff",
                                                                                border: "1px solid rgba(0, 245, 255, 0.3)",
                                                                            }
                                                                        });
                                                                    }}
                                                                >Details</Button>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        )}
                        {/* Empty states for other tabs */}
                        {activeTab !== "Orders" && (
                            <motion.div variants={fadeUp} className="mt-8">
                                <GlassPanel rounded="2xl" className="p-12 flex flex-col items-center justify-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        {activeTab === "Wishlist" && <Heart className="w-8 h-8 text-slate-500" />}
                                        {activeTab === "Settings" && <Settings className="w-8 h-8 text-slate-500" />}
                                        {activeTab === "Profile" && <User className="w-8 h-8 text-slate-500" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-semibold text-white">{activeTab}</h3>
                                        <p className="text-slate-500 mt-2 max-w-sm">
                                            This section is currently under construction. Check back later for updates.
                                        </p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="mt-4"
                                        onClick={() => setActiveTab("Orders")}
                                    >
                                        Back to Orders
                                    </Button>
                                </GlassPanel>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
