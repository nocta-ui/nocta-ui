"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

interface ShaderPlaneProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: { value: unknown } };
}

function ShaderPlane({
  vertexShader,
  fragmentShader,
  uniforms,
}: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.iTime.value = state.clock.elapsedTime * 0.5;
      material.uniforms.iResolution.value.set(size.width, size.height, 1.0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        depthTest={false}
        depthWrite={false}
        transparent={true}
      />
    </mesh>
  );
}

interface ShaderBackgroundProps {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: { [key: string]: { value: unknown } };
  className?: string;
}

export default function MoonShaderBackground({
  vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
    gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader = `
    precision highp float;

varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform float iInvert;
uniform float iMobile;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float scale = mix(1.2, 1.5, iMobile);
    vec2 uv = scale * (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
    vec2 offset = vec2(cos(iTime / 4.0), sin(iTime / 2.0));

    vec3 light_color_dark = vec3(0.95, 0.96, 0.94);
    vec3 light_color_light = vec3(0.12, 0.13, 0.14);

    vec3 light_color = mix(light_color_dark, light_color_light, iInvert);

    float light = 0.1 / distance(normalize(uv), uv);

    if (length(uv) < 1.0) {
        light *= 0.1 / distance(normalize(uv - offset), uv - offset);
    }

    float alpha = clamp(light, 0.0, 1.0);

    fragColor = vec4(light_color * alpha, alpha);
}

void main()
{
    vec4 fragColor;
    vec2 fragCoord = vUv * iResolution.xy;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
}

`,
  uniforms = {},
  className = "w-full h-full pointer-events-none",
}: ShaderBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    if (resolvedTheme) {
      setIsLight(resolvedTheme === "light");
      return;
    }
    const root = document.documentElement;
    const compute = () => setIsLight(!root.classList.contains("dark"));
    compute();
    const observer = new MutationObserver(compute);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [resolvedTheme]);

  const shaderUniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iInvert: { value: 0 },
      iMobile: { value: 0 },
      ...uniforms,
    }),
    [uniforms],
  );

  useEffect(() => {
    const invertUniform = shaderUniforms.iInvert as
      | { value: number }
      | undefined;
    if (invertUniform) {
      invertUniform.value = isLight ? 1.0 : 0.0;
    }
  }, [isLight, shaderUniforms]);

  useEffect(() => {
    const mobileUniform = shaderUniforms.iMobile as
      | { value: number }
      | undefined;
    if (mobileUniform) {
      mobileUniform.value = isMobile ? 1.0 : 0.0;
    }
  }, [isMobile, shaderUniforms]);

  return (
    <div className={className}>
      <Canvas className={className} gl={{ alpha: true }} frameloop="always">
        <ShaderPlane
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={shaderUniforms}
        />
      </Canvas>
    </div>
  );
}
