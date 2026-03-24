"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PortalTransitionProps {
    loginState: "idle" | "loading" | "success" | "error";
}

export function PortalTransition({ loginState }: PortalTransitionProps) {
    useFrame((state, delta) => {
        // If login is successful, do a hyperdrive camera push
        if (loginState === "success") {
            // Target position is far forward in Z
            const targetZ = -500;
            state.camera.position.lerp(new THREE.Vector3(0, 0, targetZ), delta * 3);

            // Motion blur simulation via FOV stretching
            state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 120, delta * 2);
            state.camera.updateProjectionMatrix();

            // Add some camera roll for dramatic effect
            state.camera.rotation.z += delta * 1.5;
        } else {
            // Idle sway
            state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
            state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 1 + 2;
            state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 60, delta * 2);
            state.camera.updateProjectionMatrix();

            // Smoothly return from any previous rotation
            state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, 0, delta);
            // Keep looking near origin
            state.camera.lookAt(0, 0, -20);
        }
    });

    return null;
}
