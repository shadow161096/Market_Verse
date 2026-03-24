"use client";

import { useEffect } from "react";

/**
 * SuppressWarnings — Cleans up the console by filtering out known library deprecation 
 * warnings that we cannot fix directly (e.g., internal Three.js Clock deprecations).
 */
export function SuppressWarnings() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const originalWarn = console.warn;

        console.warn = (...args) => {
            const message = args[0];

            // Filter out the specific THREE.Clock deprecation warning
            if (
                typeof message === "string" &&
                (message.includes("THREE.Clock") || message.includes("THREE.THREE.Clock")) &&
                message.includes("deprecated")
            ) {
                return;
            }

            originalWarn(...args);
        };

        return () => {
            console.warn = originalWarn;
        };
    }, []);

    return null;
}
