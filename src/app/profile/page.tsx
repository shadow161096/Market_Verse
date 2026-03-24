"use client";

import { useStore } from "@/store";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Shield, Package, Edit, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, logout } = useStore();
    const router = useRouter();

    if (!user) return null;

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        logout();
        router.push("/auth/login");
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <header className="mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl font-display font-bold text-white mb-2 uppercase tracking-widest">
                        Operative Identity
                    </h1>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
                        MARKETVERSE_SECURE_STORAGE // STATUS: {user.accountStatus}
                    </p>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <GlassPanel className="p-8 text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-cyan-400 transition-colors">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="mb-6 relative inline-block">
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                            {user.profilePicture ? (
                                <img src={user.profilePicture} alt={user.username} className="w-32 h-32 rounded-full border-2 border-white/10 relative z-10" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center text-4xl font-bold text-slate-500 relative z-10">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">{user.firstName} {user.lastName}</h2>
                        <p className="text-cyan-400 font-mono text-sm mb-6">@{user.username}</p>

                        <div className="space-y-4 text-left border-t border-white/5 pt-6">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Mail className="w-4 h-4 text-slate-500" />
                                <span className="font-mono">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Phone className="w-4 h-4 text-slate-500" />
                                <span className="font-mono">{user.phone || "UNSET"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <MapPin className="w-4 h-4 text-slate-500" />
                                <span className="font-mono">{user.address || "UNSET"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span className="font-mono truncate">ID_ESTABLISHED: {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3">
                            <Button variant="secondary" className="w-full gap-2 font-mono text-xs uppercase tracking-widest border-white/5 bg-white/5">
                                <Settings className="w-4 h-4" />
                                Account Settings
                            </Button>
                            <Button variant="ghost" onClick={handleLogout} className="w-full gap-2 font-mono text-xs uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/10">
                                <LogOut className="w-4 h-4" />
                                Terminate Session
                            </Button>
                        </div>
                    </GlassPanel>
                </motion.div>

                {/* Dashboard Stats / History */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <GlassPanel className="p-6 border-l-4 border-l-purple-500 bg-purple-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <Package className="w-6 h-6 text-purple-400" />
                                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Active Orders</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">0</h3>
                                <p className="text-slate-500 text-xs font-mono">No pending deployments</p>
                            </GlassPanel>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <GlassPanel className="p-6 border-l-4 border-l-cyan-500 bg-cyan-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <Shield className="w-6 h-6 text-cyan-400" />
                                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Security Level</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{user.role}</h3>
                                <p className="text-slate-500 text-xs font-mono">Military-grade protection active</p>
                            </GlassPanel>
                        </motion.div>
                    </div>

                    {/* Order History Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <GlassPanel className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Deployment Logs</h3>
                                <Button variant="ghost" className="text-xs font-mono text-purple-400 uppercase tracking-widest">View Archives</Button>
                            </div>

                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-xl">
                                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-slate-600" />
                                </div>
                                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">No mission data detected</p>
                            </div>
                        </GlassPanel>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
