'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
interface FrameworkOption {
  id: 'vite' | 'nextjs';
  name: string;
  description: string;
  logo: React.ReactNode;
}

interface FrameworkSelectorProps {
  onSelect?: (framework: 'vite' | 'nextjs') => void;
  defaultSelected?: 'vite' | 'nextjs';
  className?: string;
}

const ViteLogo = () => (
  <Image src="/icons/vite.svg" className='object-cover' alt="Vite" width={64} height={64} />
);

const NextJsLogo = () => (
  <Image src="/icons/next.svg" className='object-cover' alt="Next.js" width={64} height={64} />
);

const frameworks: FrameworkOption[] = [
  {
    id: 'vite',
    name: 'Vite',
    description: 'Fast build tool for modern web development',
    logo: <ViteLogo />
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'React framework for production applications',
    logo: <NextJsLogo />
  }
];

const FrameworkSelector = ({ 
}: FrameworkSelectorProps) => {
  return (
    <div>
      
      {/* Framework Options */}
      <div className="grid grid-cols-2 gap-3">
        {frameworks.map((framework) => (
          <Link href={`/docs/${framework.id}`} key={framework.id} className="no-underline">
            <button
              key={framework.id}
              className={`relative w-full p-4 rounded-lg border text-center flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-300`}
            >
              {framework.logo}
              <span className='text-lg font-medium -mt-3 '>{framework.name}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { FrameworkSelector };
export type { FrameworkSelectorProps }; 