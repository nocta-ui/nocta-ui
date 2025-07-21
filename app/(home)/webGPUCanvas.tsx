import { Canvas, type CanvasProps, extend } from "@react-three/fiber";
import { WebGPURenderer } from "three/webgpu";

extend({ WebGPURenderer });

const WebGPUCanvas = (props: CanvasProps) => {
	return (
		<Canvas
			{...props}
			flat
			gl={async (glProps: unknown) => {
				const renderer = new WebGPURenderer(glProps as Record<string, unknown>);
				await renderer.init();
				return renderer;
			}}
		>
			{props.children}
		</Canvas>
	);
};

export default WebGPUCanvas;
