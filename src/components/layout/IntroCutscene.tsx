"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useCinematicAudio } from "@/lib/hooks/useCinematicAudio";

const phrases = [
    "In the silence of the void",
    "A spark of innovation ignites",
    "Beyond the horizon of commerce",
    "Where vision meets reality",
    "MarketVerse Presents"
];

const LetterReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const letters = text.split("");
    return (
        <motion.span className="inline-block">
            {letters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.4,
                        delay: delay + i * 0.05,
                        ease: "easeOut"
                    }}
                    className="inline-block whitespace-pre"
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

export function IntroCutscene({ onComplete }: { onComplete: () => void }) {
    const { setIsIntroStarted } = useStore();
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    useCinematicAudio(hasStarted);

    // Auto-start the intro after a brief moment for cinematic effect
    useEffect(() => {
        const autoStartTimer = setTimeout(() => {
            if (!hasStarted) {
                handleStartJourney();
            }
        }, 1200);
        return () => clearTimeout(autoStartTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!hasStarted) return;

        if (currentPhrase < phrases.length) {
            const timer = setTimeout(() => {
                setCurrentPhrase(prev => prev + 1);
            }, 2400); // ~2.4 seconds per scene for a 12s total duration for 5 phrases
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(onComplete, 1000); // Fast fade out
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentPhrase, onComplete, hasStarted]);

    const handleSkip = () => {
        setIsExiting(true);
        setIsIntroStarted(true); // Ensure 3D skips too or just ends
        setTimeout(onComplete, 800);
    };

    const handleStartJourney = () => {
        setHasStarted(true);
        setIsIntroStarted(true); // Trigger 3D scene to start playing
    };

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Upper Cinematic Bar */}
                    <motion.div
                        className="absolute top-0 left-0 w-full bg-black/90 z-20 flex items-end justify-center pb-2"
                        initial={{ height: "100%" }}
                        animate={{ height: "12vh" }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {hasStarted && (
                            <motion.div
                                className="w-32 h-[1px] bg-white/20"
                                animate={{ scaleX: [0, 1, 0], opacity: [0, 0.5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                    </motion.div>

                    {/* Lower Cinematic Bar */}
                    <motion.div
                        className="absolute bottom-0 left-0 w-full bg-black/90 z-20 flex items-start justify-center pt-2"
                        initial={{ height: "100%" }}
                        animate={{ height: "12vh" }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {hasStarted && (
                            <motion.div
                                className="w-32 h-[1px] bg-white/20"
                                animate={{ scaleX: [0, 1, 0], opacity: [0, 0.5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            />
                        )}
                    </motion.div>

                    {/* Background Glow */}
                    <motion.div
                        className="absolute inset-0 bg-radial from-purple-900/10 to-transparent opacity-0"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Content Container */}
                    <div className="relative z-40 text-center px-6">
                        <AnimatePresence mode="wait">
                            {!hasStarted ? (
                                <motion.button
                                    key="start-btn"
                                    onClick={handleStartJourney}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                    whileHover={{ scale: 1.05, letterSpacing: "0.5em" }}
                                    className="px-10 py-4 border border-white/30 text-white tracking-[0.4em] uppercase text-sm font-display backdrop-blur-md hover:bg-white hover:text-black transition-all duration-500"
                                >
                                    Start Journey
                                </motion.button>
                            ) : (
                                phrases.map((phrase, index) => (
                                    index === currentPhrase && (
                                        <motion.h2
                                            key={phrase}
                                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                            transition={{ duration: 0.8, ease: "easeIn" }}
                                            className="text-2xl md:text-5xl font-display font-light tracking-[0.4em] text-white uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                        >
                                            <LetterReveal text={phrase} />
                                        </motion.h2>
                                    )
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Skip Button */}
                    {hasStarted && !isExiting && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1, scale: 1.05 }}
                            onClick={handleSkip}
                            className="absolute bottom-20 right-8 z-50 text-white/50 text-xs tracking-widest uppercase border border-white/20 px-4 py-2 backdrop-blur-sm transition-all"
                        >
                            Skip Intro
                        </motion.button>
                    )}

                    {/* Film Grain Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                        </svg>
                    </div>

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-30" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
