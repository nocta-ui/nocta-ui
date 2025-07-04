'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '../components/ui/button';
import Scene from './scene';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([textRef.current, ...buttonsRef.current, titleRef.current], {
        opacity: 0,
        y: 20
      });

      gsap.set(sceneRef.current, {
        filter: 'blur(24px)',
      });
      gsap.set(buttonsContainerRef.current, {
        opacity: 1,
      });

      const tl = gsap.timeline({ delay: 1 });
      
      tl.to(sceneRef.current, {
        filter: 'blur(0px)',
        duration: 2,
        ease: 'power4.out'
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power1.out'
      }, '-=1')
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power1.out'
      }, '-=0.6')
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power1.out',
        stagger: 0.1
      }, '-=0.3');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main 
      ref={containerRef} 
      className="h-[94svh] bg-custom-radial flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
      <div ref={sceneRef} className="absolute inset-0">
        <Scene />
      </div>
      
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center space-y-2 z-10 relative mt-100 md:mt-140">
        <h1 ref={titleRef} style={{opacity: 0}} className="text-xl font-semibold">Nocta UI</h1>
        <p ref={textRef} style={{opacity: 0}} className="text-sm text-nocta-600 dark:text-nocta-400 font-normal tracking-wide mb-6">
          Production-ready React components
        </p>

        <div ref={buttonsContainerRef} style={{opacity: 0}} className="flex flex-col sm:flex-row gap-4">
          <Link href="/docs" ref={(el) => { buttonsRef.current[0] = el; }}>
            <Button className="px-6 py-2.5 font-medium text-sm bg-nocta-900 hover:bg-nocta-900 dark:bg-nocta-100 dark:hover:bg-nocta-200 dark:text-nocta-900 transition-colors">
              Get Started
            </Button>
          </Link>
          <Link target="_blank" rel="noopener noreferrer" href="https://github.com/66HEX/nocta-ui" ref={(el) => { buttonsRef.current[1] = el; }}>
            <Button variant="secondary" className="px-6 py-2.5 font-medium text-sm border border-nocta-300 dark:border-nocta-600 hover:border-nocta-400 dark:hover:border-nocta-500 transition-colors">
            <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            Source Code
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
