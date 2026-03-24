"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { Planet } from "./intro/Planet";
import { MarketCity } from "./intro/MarketCity";
import { Portal } from "./intro/Portal";
import { LogoRevealScene } from "./intro/LogoRevealScene";
import { ParticleField } from "./ParticleField";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useStore } from "@/store";

export function Intro3D({ onComplete }: { onComplete: () => void }) {
    const { isIntroStarted } = useStore();
    const { camera } = useThree();
    const [scene, setScene] = useState(1);
    const [isFinishing, setIsFinishing] = useState(false);

    const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        if (!isIntroStarted) return;

        // 12 Second cinematic timeline
        const DURATION = 12;

        const tl = gsap.timeline({
            onComplete: () => {
                setIsFinishing(true);
                setTimeout(onComplete, 1000);
            }
        });

        // Initial setup: Deep Space, far back
        camera.position.set(0, 0, 400);
        camera.lookAt(0, 0, 0);

        // Continuous fluid camera movement

        // 0-3s: Move through deep space particles towards the forming city
        tl.to(camera.position, {
            z: 200,
            duration: 3,
            ease: "power2.in",
            onStart: () => setScene(1)
        }, 0);

        // 3-5s: Entering the MarketCity outer limits (speed increases)
        tl.to(camera.position, {
            x: 50,
            y: 20,
            z: 100,
            duration: 2,
            ease: "power1.inOut",
            onStart: () => setScene(2) // City Starts appearing
        }, 3);

        // 5-8s: High-speed cinematic flythrough the MarketCity structures
        tl.to(camera.position, {
            x: -20,
            y: 5,
            z: 20,
            duration: 3,
            ease: "power2.inOut",
            onStart: () => setScene(3) // City fully formed
        }, 5);

        // 8-10s: dramatic swoop into the portal/center zone
        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: -10,
            duration: 2,
            ease: "power3.in",
            onStart: () => setScene(4) // Portal/Convergence
        }, 8);

        // 10-12s: Logo reveal convergence climax
        tl.set(camera.position, { z: 80 }, 10); // Snap back slightly to see logo form
        tl.to(camera.position, {
            z: 120, // Slow pull out as logo forms and glows
            duration: 2,
            ease: "power2.out",
            onStart: () => setScene(5) // Final Logo Reveal
        }, 10);

        return () => {
            tl.kill();
        };
    }, [camera, onComplete, isIntroStarted]);

    useFrame((state) => {
        // Handheld shake increases with intensity during the fast flythrough (5-10s)
        let shakeMultiplier = 0.05;
        if (scene === 3 || scene === 4) shakeMultiplier = 0.2; // intense shake during flythrough
        if (scene === 5) shakeMultiplier = 0.02; // very stable at the end

        const shakeX = Math.sin(state.clock.elapsedTime * 3) * shakeMultiplier;
        const shakeY = Math.cos(state.clock.elapsedTime * 2.5) * shakeMultiplier;

        // Apply lookAt to the target minus the offset to keep center focus
        state.camera.lookAt(cameraTarget.current.x + shakeX, cameraTarget.current.y + shakeY, cameraTarget.current.z);
    });

    return (
        <>
            <color attach="background" args={["#020617"]} />

            <ambientLight intensity={0.5} />
            <pointLight position={[100, 100, 100]} intensity={2} color="#9333ea" />

            {/* Particle Field acts as stars, data streams, and convergence particles */}
            <ParticleField
                count={scene === 5 ? 20000 : 8000}
                speedBoost={scene >= 3 && scene <= 4 ? 8 : (scene === 5 ? 2 : 1)}
            />

            {/* Render scenes overlapping slightly based on states for smooth transitions */}
            {scene <= 2 && <Planet />}
            {(scene >= 2 && scene <= 4) && <MarketCity />}
            {scene === 4 && <Portal />}
            {scene === 5 && <LogoRevealScene />}

            <EffectComposer enableNormalPass={false}>
                <Bloom
                    intensity={scene === 5 ? 2.5 : 1.5} // Climax bloom burst
                    luminanceThreshold={0.2}
                    mipmapBlur
                />
                <ChromaticAberration offset={new THREE.Vector2(scene >= 3 && scene <= 4 ? 0.005 : 0.002, scene >= 3 && scene <= 4 ? 0.005 : 0.002)} />
                <Noise opacity={0.03} />
                <Vignette darkness={0.7} offset={0.5} />
            </EffectComposer>
        </>
    );
}
