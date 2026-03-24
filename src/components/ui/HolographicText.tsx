"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface HolographicTextProps {
    as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
}

/**
 * HolographicText — renders children with an animated holographic gradient shimmer.
 * Uses a moving background-position technique for the shimmer without heavy canvas work.
 */
export function HolographicText({
    as: Tag = "span",
    children,
    className,
    animate = true,
}: HolographicTextProps) {
    return (
        <Tag
            className={cn(
                "inline-block font-bold gradient-text",
                animate && "bg-[length:200%_100%]",
                className
            )}
            style={
                animate
                    ? {
                        backgroundImage:
                            "linear-gradient(135deg, #00f5ff 0%, #a855f7 40%, #f0abfc 70%, #00f5ff 100%)",
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "holographic-shift 4s linear infinite",
                    }
                    : {}
            }
        >
            {children}
        </Tag>
    );
}

/**
 * AnimatedCounter — counts up from 0 to `value` on mount.
 */
export function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    className,
}: {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}) {
    return (
        <motion.span
            className={cn("font-bold font-display tabular-nums", className)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {prefix}
            {value.toLocaleString()}
            {suffix}
        </motion.span>
    );
}
