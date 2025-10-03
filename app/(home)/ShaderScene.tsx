'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);
	return isMobile;
}

interface MoonUniforms {
	iTime: THREE.IUniform<number>;
	iResolution: THREE.IUniform<THREE.Vector3>;
	iInvert: THREE.IUniform<number>;
	iMobile: THREE.IUniform<number>;
	[key: string]: THREE.IUniform<any>;
}

interface ShaderPlaneProps {
	vertexShader: string;
	fragmentShader: string;
	uniforms: MoonUniforms;
	invert: number;
	mobile: number;
}

function ShaderPlane({
	vertexShader,
	fragmentShader,
	uniforms,
	invert,
	mobile,
}: ShaderPlaneProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const { size } = useThree();

	useFrame((state) => {
		const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined;
		if (!mat) return;

		uniforms.iTime.value = state.clock.elapsedTime * 0.5;
		uniforms.iResolution.value.set(size.width, size.height, 1.0);
		uniforms.iInvert.value = invert;
		uniforms.iMobile.value = mobile;
	});

	return (
		<mesh ref={meshRef}>
			<planeGeometry args={[2, 2]} />
			<shaderMaterial
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				side={THREE.FrontSide}
				depthTest={false}
				depthWrite={false}
				transparent
			/>
		</mesh>
	);
}

interface ShaderBackgroundProps {
	vertexShader?: string;
	fragmentShader?: string;
	uniforms?: Partial<MoonUniforms>;
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

        vec3 light_color_dark = vec3(0.94, 0.95, 0.96);
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
	className = 'w-full h-full pointer-events-none',
}: ShaderBackgroundProps) {
	const { resolvedTheme } = useTheme();
	const isMobile = useIsMobile();

	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const uniformsRef = useRef<MoonUniforms | null>(null);
	if (!uniformsRef.current) {
		uniformsRef.current = {
			iTime: { value: 0 },
			iResolution: { value: new THREE.Vector3(1, 1, 1) },
			iInvert: { value: 0 },
			iMobile: { value: 0 },
			...uniforms,
		} as MoonUniforms;
	}

	const invert = resolvedTheme === 'light' ? 1.0 : 0.0;
	const mobile = isMobile ? 1.0 : 0.0;

	if (!mounted) {
		return <div className={className} />;
	}

	return (
		<div className={className}>
			<Canvas className={className} gl={{ alpha: true }} frameloop="always">
				<ShaderPlane
					vertexShader={vertexShader}
					fragmentShader={fragmentShader}
					uniforms={uniformsRef.current!}
					invert={invert}
					mobile={mobile}
				/>
			</Canvas>
		</div>
	);
}
