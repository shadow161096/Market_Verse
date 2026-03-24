"use client";

import { useEffect, useRef } from "react";

// Royalty-free cinematic cyberpunk track
const AUDIO_URL = "https://cdn.pixabay.com/audio/2022/10/25/audio_5c141d6f5c.mp3";

export function useCinematicAudio(trigger: boolean) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!trigger) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            return;
        }

        if (!audioRef.current) {
            audioRef.current = new Audio(AUDIO_URL);
            audioRef.current.loop = true;
            audioRef.current.volume = 0;
        }

        const playAudio = async () => {
            try {
                await audioRef.current?.play();
                // Smooth fade in
                let vol = 0;
                const fadeInterval = setInterval(() => {
                    vol += 0.05;
                    if (audioRef.current) {
                        audioRef.current.volume = Math.min(vol, 0.4);
                        if (vol >= 0.4) clearInterval(fadeInterval);
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 100);
            } catch (err) {
                console.warn("Audio playback failed:", err);
            }
        };

        playAudio();

        return () => {
            if (audioRef.current) {
                // Smooth fade out
                let vol = audioRef.current.volume;
                const fadeInterval = setInterval(() => {
                    vol -= 0.05;
                    if (audioRef.current) {
                        audioRef.current.volume = Math.max(vol, 0);
                        if (vol <= 0) {
                            clearInterval(fadeInterval);
                            audioRef.current.pause();
                        }
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 100);
            }
        };
    }, [trigger]);
}

