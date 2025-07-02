'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, forwardRef, useEffect } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { gsap } from 'gsap'

const cubicInOut = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 0.5 * Math.pow(2 * t - 2, 3) + 1;
};

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement
      const hasDarkClass = htmlElement.classList.contains('dark')
      
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      setIsDarkMode(hasDarkClass || (!htmlElement.classList.contains('light') && systemPrefersDark))
    }

    checkDarkMode()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => checkDarkMode()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isDarkMode
}

function Logo3D() {
  const groupRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const rotationSpeedRef = useRef(0.5)
  const transitionProgressRef = useRef(0)
  const normalSpeed = -0.5
  const hoverSpeed = -0.15
  const isDarkMode = useDarkMode()

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.y = -3.5

      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 3,
        ease: 'power4.inOut',
      })
    }
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      const transitionDirection = isHovered ? -1 : 1
      
      transitionProgressRef.current = Math.max(
        0, 
        Math.min(
          1, 
          transitionProgressRef.current + transitionDirection * delta * 1.5
        )
      )
      
      const easedProgress = cubicInOut(transitionProgressRef.current)
      
      rotationSpeedRef.current = THREE.MathUtils.lerp(
        hoverSpeed,
        normalSpeed,
        easedProgress
      )
      
      groupRef.current.rotation.y += rotationSpeedRef.current * delta
    }
  })
  
  const svgPath = "M18 0C21.3137 0 24 2.68629 24 6V18C24 21.3137 21.3137 24 18 24H6C2.6863 24 8.24673e-06 21.3137 0 18V6C0 2.68629 2.68629 0 6 0H18ZM5 10C4.44772 10 4 10.4477 4 11V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 17.5523 8 17V10H5ZM9 6C8.44772 6 8 6.44772 8 7V10H13.7139C13.979 9.99996 14.2334 9.89453 14.4209 9.70703C14.8114 9.3166 15.4444 9.31667 15.835 9.70703L16.6143 10.4854C17.0046 10.8758 17.0045 11.5089 16.6143 11.8994L16.293 12.2207C16.1055 12.4082 16 12.6626 16 12.9277V17C16 17.5523 16.4477 18 17 18H19C19.5523 18 20 17.5523 20 17V10.542C20 10.2768 19.8945 10.0225 19.707 9.83496L16.165 6.29297C15.9775 6.10547 15.7232 6.00004 15.458 6H9Z"

  const extrudedGeometry = useMemo(() => {
    try {
      const svgString = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="${svgPath}" />
        </svg>
      `
      
      const loader = new SVGLoader()
      const svgData = loader.parse(svgString)
      
      const shapes: THREE.Shape[] = []
      svgData.paths.forEach((path) => {
        const pathShapes = SVGLoader.createShapes(path)
        shapes.push(...pathShapes)
      })

      if (shapes.length > 0) {
                  const extrudeSettings = {
            depth: 5,
            bevelEnabled: true,
            bevelSegments: 32,
            bevelSize: 0.1,
            bevelThickness: 0.1,
            curveSegments: 32,
            steps: 30,
          }

        const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings)
        
        geometry.computeBoundingBox()
        geometry.center()
        
        return geometry
      }
    } catch (error) {
      console.error('Error parsing SVG:', error)
    }
    
    return new THREE.BoxGeometry(1, 1, 0.5)
  }, [svgPath])

  const logoColor = isDarkMode ? "#f9f9f9" : "#000000"

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <mesh 
        position={[0, 0, 0]} 
        rotation={[Math.PI, Math.PI, 0]}
        castShadow 
        receiveShadow
        scale={[0.08, 0.08, 0.08]}
      >
        <primitive object={extrudedGeometry} />
        <meshPhysicalMaterial 
          color={logoColor}
          metalness={1}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

const Scene = forwardRef<HTMLDivElement>((props, ref) => {
  const pointLightRef = useRef<THREE.PointLight>(null)

  useEffect(() => {
    if (pointLightRef.current) {
      pointLightRef.current.position.y = -3.5

      gsap.to(pointLightRef.current.position, {
        y: 0,
        duration: 3,
        ease: 'power4.inOut',
      })
    }
  }, [])

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
      >
        <ambientLight intensity={30} />
        <pointLight position={[5, 5, 0]} intensity={100} />
        <pointLight position={[15, 5, 0]} intensity={100} />
        <pointLight position={[5, 5, 15]} intensity={100} />
        <pointLight position={[0, 10, 5]} intensity={100} />
        <pointLight position={[-20, -10, -5]} intensity={100} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <Logo3D />

      </Canvas>
    </div>
  )
})

Scene.displayName = 'Scene'

export default Scene
