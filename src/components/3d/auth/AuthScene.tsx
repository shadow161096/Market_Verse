"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CyberParticles } from "./CyberParticles";
import { HoloGrid } from "./HoloGrid";
import { PortalTransition } from "./PortalTransition";
import { useGPUQuality } from "@/lib/hooks/useGPUQuality";

interface AuthSceneProps {
    loginState: "idle" | "loading" | "success" | "error";
}

export function AuthScene({ loginState }: AuthSceneProps) {
    const mousePosition = useRef({ x: 0.5, y: 0.5 });
    const { quality, loading } = useGPUQuality();

    // Track mouse uniformly from 0 to 1
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (loading) {
        return <div className="absolute inset-0 bg-[#020617] -z-10" />;
    }

    const dprSetting: [number, number] = quality === 'low' ? [1, 1] : [1, 1.5];

    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020617] to-[#0f172a] overflow-hidden">
            <Canvas
                camera={{ position: [0, 2, 20], fov: 60 }}
                gl={{ powerPreference: "high-performance", antialias: quality !== 'low', alpha: false }}
                dpr={dprSetting} // Clamp pixel ratio for better performance based on GPU
            >
                <color attach="background" args={["#020617"]} />

                <fog attach="fog" args={["#020617", 10, 100]} />

                <ambientLight intensity={0.2} />
                <pointLight position={[0, 10, 0]} intensity={loginState === 'error' ? 5 : 2} color={loginState === 'error' ? "#ef4444" : "#a855f7"} />

                <CyberParticles loginState={loginState} mousePosition={mousePosition} />
                <HoloGrid />
                <PortalTransition loginState={loginState} />

                {quality !== 'low' && (
                    <EffectComposer enableNormalPass={false}>
                        <Bloom
                            intensity={loginState === "loading" ? 3 : (loginState === "success" ? 5 : 1.5)}
                            luminanceThreshold={0.2}
                            mipmapBlur
                        />
                        <ChromaticAberration
                            offset={new THREE.Vector2(loginState === "success" ? 0.01 : 0.002, loginState === "success" ? 0.01 : 0.002)}
                            blendFunction={BlendFunction.NORMAL}
                        />
                        <Vignette darkness={0.6} offset={0.5} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
