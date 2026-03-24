"use client";

import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "neon" | "purple" | "pink" | "success" | "warning" | "danger";

interface BadgeProps {
    variant?: BadgeVariant;
    className?: string;
    children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-white/10 text-slate-300 border-white/10",
    neon: "bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    pink: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full",
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
