"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const portalVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Spiraling effect
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float spiral = sin(dist * 20.0 - uTime * 5.0 + angle * 3.0);
    
    // Core glow
    float core = 1.0 - smoothstep(0.0, 0.4, dist);
    
    // Rings
    float ring1 = step(0.45, dist) * (1.0 - step(0.48, dist));
    float ring2 = step(0.49, dist) * (1.0 - step(0.5, dist));
    
    vec3 color = vec3(0.57, 0.2, 0.92); // #9333ea
    color = mix(color, vec3(0.23, 0.51, 0.96), spiral * 0.5 + 0.5); // #3b82f6
    
    float alpha = (core + ring1 + ring2 + spiral * 0.2) * (1.0 - dist * 2.0);
    
    gl_FragColor = vec4(color * alpha * 2.0, alpha);
  }
`;

export function Portal() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 }
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 200]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={portalVertexShader}
                fragmentShader={portalFragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
