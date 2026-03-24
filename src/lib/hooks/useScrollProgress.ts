"use client";

import { useScroll, useSpring } from "framer-motion";

/**
 * useScrollProgress — returns a spring-smoothed scroll progress value.
 * Used to drive 3D scene rotation and parallax effects.
 */
export function useScrollProgress() {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    return { scrollYProgress, smoothProgress };
}
