'use client';

import React, { useState } from 'react';
import { Avatar } from './avatar';

export const BasicAvatarDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar fallback="JD" />
      <Avatar />
    </div>
  );
};

export const SizesDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar 
        size="xs" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        size="sm" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        size="md" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        size="lg" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        size="xl" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        size="2xl" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
    </div>
  );
};

export const VariantsDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar 
        variant="circle" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        variant="square" 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar variant="circle" fallback="JD" />
      <Avatar variant="square" fallback="JD" />
    </div>
  );
};

export const StatusDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
        status="online"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
        alt="Jane Smith" 
        status="away"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
        alt="Mike Johnson" 
        status="busy"
      />
      <Avatar 
        fallback="AB" 
        status="offline"
      />
    </div>
  );
};

export const FallbackDemo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Avatar 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
      />
      <Avatar 
        src="https://invalid-url.jpg" 
        fallback="JD" 
        alt="John Doe" 
      />
      <Avatar fallback="Sarah Connor" />
      <Avatar fallback="AB" />
      <Avatar />
    </div>
  );
};

export const GroupDemo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Avatar 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
        className="ring-2 ring-white dark:ring-neutral-900"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
        alt="Jane Smith" 
        className="-ml-2 ring-2 ring-white dark:ring-neutral-900"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
        alt="Mike Johnson" 
        className="-ml-2 ring-2 ring-white dark:ring-neutral-900"
      />
      <Avatar 
        fallback="AB" 
        className="-ml-2 ring-2 ring-white dark:ring-neutral-900"
      />
      <div className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 ring-2 ring-white dark:ring-neutral-900 text-xs font-medium text-neutral-600 dark:text-neutral-400">
        +5
      </div>
    </div>
  );
};

export const CustomStylingDemo: React.FC = () => {
  return (
    <div className="my-6 flex items-center gap-4">
      <Avatar 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe" 
        className="ring-4 ring-blue-500/50"
      />
      <Avatar 
        fallback="JD" 
        className="bg-gradient-to-br from-purple-500 to-pink-500 text-white"
      />
      <Avatar 
        src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
        alt="John Doe"
        className="grayscale hover:grayscale-0 transition-all duration-300"
      />
    </div>
  );
};

export const ClickHandlersDemo: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  const handleAvatarClick = (name: string) => {
    setMessage(`${name} avatar clicked!`);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <Avatar 
          src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
          alt="John Doe" 
          className="cursor-pointer hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600 transition-all"
          onClick={() => handleAvatarClick('John Doe')}
        />
        <Avatar 
          fallback="JS" 
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={() => handleAvatarClick('Jane Smith')}
        />
      </div>
      {message && (
        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
          {message}
        </div>
      )}
    </div>
  );
};

export const InteractiveDemo: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');
  const [selectedVariant, setSelectedVariant] = useState<'circle' | 'square'>('circle');
  const [selectedStatus, setSelectedStatus] = useState<'online' | 'offline' | 'away' | 'busy' | null>('online');

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Avatar 
          src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png" 
          alt="John Doe" 
          size={selectedSize}
          variant={selectedVariant}
          status={selectedStatus}
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <div className="flex gap-2">
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedSize === size
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Variant</label>
          <div className="flex gap-2">
            {(['circle', 'square'] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-3 py-1 rounded-md text-sm capitalize ${
                  selectedVariant === variant
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="flex gap-2">
            {([null, 'online', 'offline', 'away', 'busy'] as const).map((status) => (
              <button
                key={status || 'none'}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-md text-sm capitalize ${
                  selectedStatus === status
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {status || 'none'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 