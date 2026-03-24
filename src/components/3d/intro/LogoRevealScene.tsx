"use client";

import { Text, Float, Sparkles } from "@react-three/drei";

export function LogoRevealScene() {
    return (
        <group>
            <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
                <group scale={1.5}>
                    <Text
                        fontSize={20}
                        color="#ffffff"
                        font="/fonts/Inter-Black.ttf"
                        anchorX="center"
                        anchorY="middle"
                        letterSpacing={0.2}
                    >
                        MARKETVERSE
                        <meshStandardMaterial
                            emissive="#9333ea"
                            emissiveIntensity={4}
                            toneMapped={false}
                        />
                    </Text>

                    <Text
                        position={[0, -25, 0]}
                        fontSize={6}
                        color="#94a3b8"
                        font="/fonts/Inter-Regular.ttf"
                        anchorX="center"
                        anchorY="middle"
                        letterSpacing={0.4}
                    >
                        THE FUTURE OF ONLINE COMMERCE
                    </Text>
                </group>
            </Float>

            <Sparkles
                count={200}
                scale={100}
                size={2}
                speed={0.5}
                color="#9333ea"
            />
        </group>
    );
}
