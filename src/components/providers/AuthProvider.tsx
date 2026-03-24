"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setAuth, isAuthenticated } = useStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const user = await res.json();
                    setAuth(user);
                } else {
                    setAuth(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setAuth(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [setAuth]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[9999]">
                <div className="relative">
                    <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
                </div>
                <p className="mt-6 text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
                    Synchronizing Neural Link...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
