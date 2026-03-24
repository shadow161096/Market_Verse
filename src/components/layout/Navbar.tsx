"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Search,
    Menu,
    X,
    Zap,
    LayoutGrid,
    User,
    Settings,
} from "lucide-react";
import { useStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
];

export function Navbar() {
    const pathname = usePathname();
    const { itemCount, openCart, openSearch, isMobileNavOpen, openMobileNav, closeMobileNav, isAuthenticated, user, logout } =
        useStore();
    const count = itemCount();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            logout();
            window.location.href = "/auth/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                <GlassPanel
                    variant="dark"
                    rounded="md"
                    className="mx-4 mt-3 px-6 py-3 rounded-2xl border-white/8 shadow-2xl"
                >
                    <nav className="flex items-center justify-between gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:scale-110 transition-transform">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span
                                className="text-lg font-bold font-display gradient-text"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, #e2e8f0 0%, #a855f7 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                MarketVerse
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <ul className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-400 hover:text-white"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-active-pill"
                                                    className="absolute inset-0 bg-white/8 rounded-lg"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <span className="relative z-10">{link.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={openSearch}
                                aria-label="Search"
                                className="hidden md:flex"
                            >
                                <Search className="w-4 h-4" />
                            </Button>

                            {/* Cart */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={openCart}
                                aria-label="Cart"
                                className="relative"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <AnimatePresence>
                                    {count > 0 && (
                                        <motion.span
                                            key="cart-badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#a855f7] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                        >
                                            {count > 9 ? "9+" : count}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>

                            {/* User Section */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-2 border-l border-white/10 pl-2">
                                    <Link href="/profile">
                                        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 items-center">
                                            {user?.profilePicture ? (
                                                <img src={user.profilePicture} alt={user.username} className="w-6 h-6 rounded-full border border-white/20" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                    {user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs font-mono opacity-70">{user?.username}</span>
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/auth/login">
                                    <Button variant="primary" size="sm" className="text-xs font-mono uppercase tracking-widest hidden md:flex">
                                        Establish Link
                                    </Button>
                                </Link>
                            )}

                            {/* Mobile menu toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={isMobileNavOpen ? closeMobileNav : openMobileNav}
                                aria-label="Menu"
                            >
                                {isMobileNavOpen ? (
                                    <X className="w-4 h-4" />
                                ) : (
                                    <Menu className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </nav>
                </GlassPanel>
            </motion.header>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden"
                            onClick={closeMobileNav}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-72 z-50 glass-strong border-l border-white/10 md:hidden flex flex-col p-6 gap-6"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-display font-bold text-white">Menu</span>
                                <Button variant="ghost" size="icon" onClick={closeMobileNav}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <ul className="flex flex-col gap-2">
                                {NAV_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={closeMobileNav}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                                pathname === link.href
                                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start gap-3"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
