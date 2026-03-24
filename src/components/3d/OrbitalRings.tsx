"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * OrbitalRings — three wireframe tori orbiting at different angles.
 * Each ring has its own axis and speed for an organic, non-repeating feel.
 * MeshBasicMaterial with wireframe keeps the draw call count minimal.
 */
interface OrbitalRingsProps {
    quality?: 'low' | 'medium' | 'high';
}

export function OrbitalRings({ quality = 'medium' }: OrbitalRingsProps) {
    const isLow = quality === 'low';
    const ring1 = useRef<THREE.Mesh>(null);
    const ring2 = useRef<THREE.Mesh>(null);
    const ring3 = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (ring1.current) {
            ring1.current.rotation.z += delta * 0.12;
            ring1.current.rotation.x += delta * 0.05;
        }
        if (ring2.current) {
            ring2.current.rotation.x += delta * 0.09;
            ring2.current.rotation.y += delta * 0.07;
        }
        if (ring3.current) {
            ring3.current.rotation.y += delta * 0.06;
            ring3.current.rotation.z -= delta * 0.04;
        }
    });

    return (
        <group>
            {/* Outer ring — cyan */}
            <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[22, 0.08, isLow ? 4 : 8, isLow ? 60 : 120]} />
                <meshBasicMaterial color="#00c8d4" transparent opacity={0.25} />
            </mesh>

            {/* Mid ring — purple */}
            <mesh ref={ring2} rotation={[0, Math.PI / 5, Math.PI / 4]}>
                <torusGeometry args={[16, 0.06, isLow ? 4 : 8, isLow ? 45 : 90]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
            </mesh>

            {/* Inner ring — pink */}
            <mesh ref={ring3} rotation={[Math.PI / 6, Math.PI / 3, 0]}>
                <torusGeometry args={[10, 0.05, isLow ? 4 : 8, isLow ? 30 : 60]} />
                <meshBasicMaterial color="#f0abfc" transparent opacity={0.18} />
            </mesh>
        </group>
    );
}
