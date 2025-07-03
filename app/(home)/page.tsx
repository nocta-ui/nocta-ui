'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '../components/ui/button';
import Scene from './scene';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([textRef.current, buttonsRef.current, titleRef.current], {
        opacity: 0,
        y: 20
      });

      gsap.set(sceneRef.current, {
        filter: 'blur(30px)',
        opacity: 0
      });

      const tl = gsap.timeline({ delay: 1 });
      
      tl.to(sceneRef.current, {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1,
        ease: 'power4.out'
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power1.out'
      })
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
        ease: 'power1.out'
      }, '-=0.3');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="h-[93svh] flex flex-col justify-center items-center text-center px-6 relative bg-nocta-50 dark:bg-nocta-950">
      <div ref={sceneRef} className="absolute inset-0">
        <Scene />
      </div>
      
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center space-y-2 z-10 relative mt-100 md:mt-140">
        <h1 ref={titleRef} className="text-xl font-semibold">Nocta UI</h1>
        <p ref={textRef} className="text-sm text-nocta-600 dark:text-nocta-400 font-normal tracking-wide mb-6">
          Production-ready React components
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
          <Link href="/docs">
            <Button className="px-6 py-2.5 font-medium text-sm bg-nocta-900 hover:bg-nocta-900 dark:bg-nocta-100 dark:hover:bg-nocta-200 dark:text-nocta-900 transition-colors">
              Documentation
            </Button>
          </Link>
          <Link target="_blank" rel="noopener noreferrer" href="https://github.com/66HEX/nocta-ui">
            <Button variant="secondary" className="px-6 py-2.5 font-medium text-sm border border-nocta-300 dark:border-nocta-600 hover:border-nocta-400 dark:hover:border-nocta-500 transition-colors">
              GitHub
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
