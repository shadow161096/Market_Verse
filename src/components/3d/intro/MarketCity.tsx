"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";

interface BuildingProps {
    position: [number, number, number];
    height: number;
    width: number;
    color: string;
}

// Pre-create shared geometries to save memory and CPU
const sharedBox = new THREE.BoxGeometry(1, 1, 1);
const sharedEdges = new THREE.EdgesGeometry(sharedBox);

function Building({ position, height, width, color }: BuildingProps) {
    return (
        <group position={position}>
            <mesh scale={[width, height, width]}>
                <primitive object={sharedBox} attach="geometry" />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.6}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>
            <lineSegments scale={[width, height, width]}>
                <primitive object={sharedEdges} attach="geometry" />
                <lineBasicMaterial color={color} />
            </lineSegments>
        </group>
    );
}

export function MarketCity() {
    const groupRef = useRef<THREE.Group>(null!);

    const buildings = useMemo(() => {
        const b = [];
        const colors = ["#9333ea", "#3b82f6", "#f59e0b"]; // Purple, Blue, Gold
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 100;
            const h = 20 + Math.random() * 80;
            b.push({
                position: [
                    Math.cos(angle) * radius,
                    h / 2,
                    Math.sin(angle) * radius
                ] as [number, number, number],
                height: h,
                width: 5 + Math.random() * 15,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        return b;
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
    });

    return (
        <group ref={groupRef}>
            {buildings.map((b, i) => (
                <Building key={i} {...b} />
            ))}

            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Text
                    position={[0, 120, 0]}
                    fontSize={20}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    MARKETVERSE
                    <meshStandardMaterial emissive="#9333ea" emissiveIntensity={2} />
                </Text>
            </Float>

            {/* Ground Grid */}
            <gridHelper args={[1000, 50, "#334155", "#1e293b"]} position={[0, -1, 0]} />
        </group>
    );
}
