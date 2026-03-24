"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Instagram } from "lucide-react";

const FOOTER_LINKS = {
    Shop: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products?filter=new" },
        { label: "Featured", href: "/products?filter=featured" },
        { label: "Sale", href: "/products?filter=sale" },
    ],
    Account: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Orders", href: "/dashboard/orders" },
        { label: "Wishlist", href: "/dashboard/wishlist" },
        { label: "Settings", href: "/dashboard/settings" },
    ],
    Company: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-white/6 mt-24">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00f5ff] flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-display font-bold text-white text-lg">
                                MarketVerse
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            The next-generation marketplace for futuristic products. Experience
                            commerce reimagined.
                        </p>
                        <div className="flex gap-3">
                            {[Github, Twitter, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                        <div key={group} className="flex flex-col gap-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {group}
                            </span>
                            <ul className="flex flex-col gap-2.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-500 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-600">
                        © {new Date().getFullYear()} MarketVerse. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-600">
                        Built with Next.js · Three.js · Framer Motion
                    </p>
                </div>
            </div>
        </footer>
    );
}
