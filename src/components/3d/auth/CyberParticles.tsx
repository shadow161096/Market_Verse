"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CyberParticlesProps {
    loginState: "idle" | "loading" | "success" | "error";
    mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

export function CyberParticles({ loginState, mousePosition }: CyberParticlesProps) {
    const count = 4000;
    const particlesRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const radius = 20 + Math.random() * 80;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos((Math.random() * 2) - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            temp.push({
                position: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1),
                originalPos: new THREE.Vector3(x, y, z),
                phase: Math.random() * Math.PI * 2,
            });
        }
        return temp;
    }, [count]);

    const targetColor = useMemo(() => new THREE.Color(), []);
    const currentColor = useMemo(() => new THREE.Color("#00f5ff"), []);

    // Pre-allocate scratch vectors for high-performance loops
    const centerVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const axisVec = useMemo(() => new THREE.Vector3(0, 1, 0), []);
    const tempDirVec = useMemo(() => new THREE.Vector3(), []);
    const mouseScratchVec = useMemo(() => new THREE.Vector3(), []);
    const repelDirVec = useMemo(() => new THREE.Vector3(), []);
    const shiverVec = useMemo(() => new THREE.Vector3(), []);

    useFrame((state, delta) => {
        if (!particlesRef.current) return;

        // Determine target color based on state
        switch (loginState) {
            case "loading": targetColor.set("#a855f7"); break; // Purple pulse
            case "success": targetColor.set("#10b981"); break; // Green explosion
            case "error": targetColor.set("#ef4444"); break; // Red alert
            default: targetColor.set("#00f5ff"); break; // Cyan idle
        }

        // Lerp material color
        currentColor.lerp(targetColor, delta * 3);
        (particlesRef.current.material as THREE.MeshBasicMaterial).color = currentColor;

        const time = state.clock.elapsedTime;

        for (let i = 0; i < count; i++) {
            const p = particles[i];

            if (loginState === "loading") {
                // Converge to center
                p.position.lerp(centerVec, delta * 2);
                // Swirl
                p.position.applyAxisAngle(axisVec, delta * 2);
            } else if (loginState === "success") {
                // Explode outwards rapidly
                tempDirVec.copy(p.position).normalize();
                p.position.add(tempDirVec.multiplyScalar(delta * 150));
            } else if (loginState === "error") {
                // Shiver and flash
                shiverVec.set(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
                p.position.add(shiverVec);
            } else {
                // Idle state: float gently, react slightly to mouse
                p.position.add(p.velocity);

                // Sine wave bobbing
                p.position.y += Math.sin(time + p.phase) * 0.05;

                // Gentle pull towards original position if drifting too far
                if (p.position.distanceTo(p.originalPos) > 10) {
                    p.position.lerp(p.originalPos, delta * 0.5);
                }

                // Mouse repulsion
                mouseScratchVec.set(
                    (mousePosition.current.x * 2 - 1) * 30, // Map 0-1 to -30 to 30
                    -(mousePosition.current.y * 2 - 1) * 30,
                    0
                );
                const dist = p.position.distanceTo(mouseScratchVec);
                if (dist < 15) {
                    repelDirVec.copy(p.position).sub(mouseScratchVec).normalize();
                    p.position.add(repelDirVec.multiplyScalar(delta * 20));
                }
            }

            dummy.position.copy(p.position);

            // Scale pulse based on distance to center and time
            const distToCenter = p.position.length();
            const scale = Math.max(0.1, Math.sin(time * 2 + p.phase) * 0.5 + 0.5 + (50 / distToCenter));
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            particlesRef.current.setMatrixAt(i, dummy.matrix);
        }
        particlesRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial
                color="#00f5ff"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </instancedMesh>
    );
}
