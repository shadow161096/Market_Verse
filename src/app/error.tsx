"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";

/**
 * Error boundary for App Router. Receives reset() from Next.js to
 * allow the user to retry the failed render.
 */
export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <GlassPanel rounded="2xl" glow="pink" className="p-10 flex flex-col items-center gap-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-white">Something went wrong</h1>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            {error.message ?? "An unexpected error occurred. Please try again."}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-slate-600 font-mono mt-3">Digest: {error.digest}</p>
                        )}
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                        onClick={reset}
                    >
                        Try Again
                    </Button>
                </GlassPanel>
            </motion.div>
        </div>
    );
}
