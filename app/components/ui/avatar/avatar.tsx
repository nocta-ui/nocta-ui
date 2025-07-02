'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy' | null;
  className?: string;
}

// Avatar Component
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  variant = 'circle',
  status = null,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    if (src) {
      setImageError(false);
    }
  }, [src]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Generate initials from fallback or alt text
  const getInitials = () => {
    const text = fallback || alt || '';
    if (!text) return '';
    
    // If text is 2 characters or less and has no spaces, treat as ready initials
    if (text.length <= 2 && !text.includes(' ')) {
      return text.toUpperCase();
    }
    
    // Otherwise, generate initials from words
    return text
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseStyles = `
    relative inline-flex items-center justify-center
    bg-nocta-200 dark:bg-nocta-800
    text-nocta-700 dark:text-nocta-300
    font-medium select-none
    transition-all duration-200 ease-in-out
    not-prose
  `;

  const variants = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  };

  const sizes = {
    xs: {
      container: 'h-6 w-6',
      text: 'text-xs',
      icon: 'h-3 w-3',
      status: 'h-1.5 w-1.5 ring-1'
    },
    sm: {
      container: 'h-8 w-8',
      text: 'text-xs',
      icon: 'h-4 w-4',
      status: 'h-2 w-2 ring-1'
    },
    md: {
      container: 'h-10 w-10',
      text: 'text-sm',
      icon: 'h-5 w-5',
      status: 'h-2.5 w-2.5 ring-1'
    },
    lg: {
      container: 'h-12 w-12',
      text: 'text-base',
      icon: 'h-6 w-6',
      status: 'h-3 w-3 ring-1'
    },
    xl: {
      container: 'h-16 w-16',
      text: 'text-lg',
      icon: 'h-8 w-8',
      status: 'h-3.5 w-3.5 ring-1'
    },
    '2xl': {
      container: 'h-20 w-20',
      text: 'text-xl',
      icon: 'h-10 w-10',
      status: 'h-4 w-4 ring-1'
    }
  };

  const statusStyles = {
    online: 'bg-green-500 dark:bg-green-600',
    offline: 'bg-nocta-400 dark:bg-nocta-600',
    away: 'bg-yellow-500 dark:bg-yellow-600',
    busy: 'bg-red-500 dark:bg-red-600'
  };

  const statusPositions = {
    xs: 'bottom-0 right-0',
    sm: 'bottom-0 right-0',
    md: 'bottom-0.5 right-0.5',
    lg: 'bottom-0.5 right-0.5',
    xl: 'bottom-1 right-1',
    '2xl': 'bottom-1 right-1'
  };

  const showImage = src && !imageError;
  const showInitials = !showImage && getInitials();

  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size].container}
        ${className}
      `}
      {...props}
    >
      {/* Image */}
      {showImage && (
        <img
          src={src}
          alt=""
          className={cn('h-full w-full object-cover', variants[variant])}
          onError={handleImageError}
          loading="eager"
          style={{
            textIndent: '-9999px',
            overflow: 'hidden'
          }}
        />
      )}

      {/* Initials fallback */}
      {showInitials && (
        <span className={`${sizes[size].text} font-medium`}>
          {getInitials()}
        </span>
      )}

      {/* Default fallback icon */}
      {!showImage && !showInitials && (
        <svg
          className={cn(sizes[size].icon, 'text-nocta-400 dark:text-nocta-500')}
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
        </svg>
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={cn('absolute rounded-full', statusStyles[status], sizes[size].status, statusPositions[size], 'ring-white dark:ring-nocta-900')}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}; 