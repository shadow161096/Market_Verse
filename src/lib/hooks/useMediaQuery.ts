"use client";

import { useState, useEffect } from "react";

/**
 * useMediaQuery — returns a boolean for whether the given CSS media query matches.
 * Used for adaptive features (e.g., reducing particle count on mobile).
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(query);
        setMatches(mq.matches);

        const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [query]);

    return matches;
}
