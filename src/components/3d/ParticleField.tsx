"use client";

/**
 * ParticleField — Three.js / @react-three/fiber code-generated particle system.
 *
 * Performance strategy:
 * - Single BufferGeometry with all particles packed into Float32Array (avoids per-mesh overhead)
 * - useFrame with delta-based animation (frame-rate independent, never wastes budget)
 * - Adaptive particle count: ~2000 desktop, ~600 mobile
 * - Points material with additive blending for the neon glow look
 * - No static assets — geometry is generated entirely in code
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
    count?: number;
    speedBoost?: number;
}

export function ParticleField({ count = 2000, speedBoost = 1 }: ParticleFieldProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const timeRef = useRef(0);

    // Build geometry once via useMemo
    const { positions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const palette = [
            [0, 0.96, 1],       // neon cyan
            [0.66, 0.33, 0.97], // neon purple
            [0.94, 0.67, 0.99], // neon pink
            [0.06, 0.72, 0.51], // neon emerald
        ];

        for (let i = 0; i < count; i++) {
            const r = 40 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const [r2, g, b] = palette[Math.floor(Math.random() * palette.length)];
            const dim = 0.3 + Math.random() * 0.7;
            colors[i * 3] = r2 * dim;
            colors[i * 3 + 1] = g * dim;
            colors[i * 3 + 2] = b * dim;

            sizes[i] = 0.5 + Math.random() * 1.5;
        }

        return { positions, colors, sizes };
    }, [count]);

    // Animate: slow orbital drift + subtle breathing + speedBoost
    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        timeRef.current += delta * speedBoost;
        const t = timeRef.current;

        // Overall slow rotation (+ speedBoost)
        pointsRef.current.rotation.y = t * 0.04;
        pointsRef.current.rotation.x = Math.sin(t * 0.015) * 0.15;

        // Breathe scale
        const breathe = 1 + Math.sin(t * 0.5) * 0.015;

        // Stretch particles on Z to create light streaks during high speedBoost
        const zStretch = speedBoost > 3 ? speedBoost * 1.5 : 1;

        pointsRef.current.scale.set(breathe, breathe, breathe * zStretch);
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.3}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
