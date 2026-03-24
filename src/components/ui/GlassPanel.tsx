"use client";

import { cn } from "@/lib/utils/cn";

interface GlassPanelProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    variant?: "default" | "strong" | "dark";
    glow?: "none" | "cyan" | "purple" | "pink";
    rounded?: "md" | "lg" | "xl" | "2xl" | "3xl";
}

const glowClasses = {
    none: "",
    cyan: "shadow-[0_0_30px_rgba(0,245,255,0.08),inset_0_1px_0_rgba(0,245,255,0.1)]",
    purple:
        "shadow-[0_0_30px_rgba(168,85,247,0.12),inset_0_1px_0_rgba(168,85,247,0.15)]",
    pink: "shadow-[0_0_30px_rgba(240,171,252,0.08),inset_0_1px_0_rgba(240,171,252,0.1)]",
};

const variantClasses = {
    default: "glass",
    strong: "glass-strong",
    dark: "glass-dark",
};

const roundedClasses = {
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
};

export function GlassPanel({
    className,
    style,
    children,
    variant = "default",
    glow = "none",
    rounded = "2xl",
}: GlassPanelProps) {
    return (
        <div
            style={style}
            className={cn(
                variantClasses[variant],
                glowClasses[glow],
                roundedClasses[rounded],
                className
            )}
        >
            {children}
        </div>
    );
}
