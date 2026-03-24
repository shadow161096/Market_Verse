"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const gridVertexShader = `
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const gridFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    // Cyber grid math
    vec2 coord = vWorldPosition.xz * 0.1;

    // Moving effect
    coord.y -= uTime * 2.0;

    // Grid lines
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
    float colorLine = 1.0 - min(line, 1.0);

    // Fade into distance
    float dist = length(vWorldPosition.xz);
    float fade = 1.0 - smoothstep(20.0, 100.0, dist);

    // Dynamic glow pulse
    float pulse = sin(uTime * 2.0 + dist * 0.1) * 0.5 + 0.5;

    vec3 finalColor = uColor * colorLine * fade * (0.5 + pulse * 0.5);

    gl_FragColor = vec4(finalColor, colorLine * fade * 0.8);
  }
`;

export function HoloGrid() {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#7c3aed") }, // Deep violet matching MarketVerse
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
            <planeGeometry args={[400, 400, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={gridVertexShader}
                fragmentShader={gridFragmentShader}
                uniforms={uniforms}
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
