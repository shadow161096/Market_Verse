"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { OrbitalRings } from "./OrbitalRings";
import { useGPUQuality } from "@/lib/hooks/useGPUQuality";
import { useStore } from "@/store";
import * as THREE from "three";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import { Intro3D } from "./Intro3D";

function Scene({ quality, particleCount, hasSeenIntro, setHasSeenIntro }: { quality: "low" | "medium" | "high", particleCount: number, hasSeenIntro: boolean, setHasSeenIntro: (seen: boolean) => void }) {
    if (!hasSeenIntro) {
        return <Intro3D onComplete={() => setHasSeenIntro(true)} />;
    }

    return (
        <Suspense fallback={null}>
            <ParticleField count={particleCount} speedBoost={1} />
            <OrbitalRings quality={quality} />

            <EffectComposer enableNormalPass={false}>
                <Bloom
                    intensity={1.5}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                <ChromaticAberration
                    offset={new THREE.Vector2(0.002, 0.002)}
                    blendFunction={BlendFunction.NORMAL}
                />
                <Vignette
                    eskil={false}
                    offset={0.5}
                    darkness={0.5}
                />
            </EffectComposer>
        </Suspense>
    );
}

/**
 * AnimatedBackground — The 3D scene wrapper.
 * Uses useGPUQuality to scale complexity based on hardware.
 */
export function AnimatedBackground() {
    const { quality, loading } = useGPUQuality();
    const { hasSeenIntro, setHasSeenIntro } = useStore();

    const particleCount = useMemo(() => {
        switch (quality) {
            case 'low': return 1200;
            case 'medium': return 4000;
            case 'high': return 8000;
            default: return 4000;
        }
    }, [quality]);

    if (loading) {
        return <div className="absolute inset-0 bg-[#020617] -z-10" />;
    }

    return (
        <div className="absolute inset-0 -z-10 bg-[#020617] overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 150], fov: 75 }}
                dpr={quality === 'low' ? [1, 1] : [1, 1.5]}
                gl={{
                    antialias: quality !== 'low',
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                style={{ background: "transparent" }}
            >
                <Scene quality={quality} particleCount={particleCount} hasSeenIntro={hasSeenIntro} setHasSeenIntro={setHasSeenIntro} />
            </Canvas>
        </div>
    );
}

