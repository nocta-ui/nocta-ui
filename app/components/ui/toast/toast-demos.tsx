'use client';

import React from 'react';
import { useToast, ToastProvider, ToastPosition } from './toast';
import { Button } from '../button';

// Basic demo - single toast example
export const BasicToastDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <BasicToastExample />
      </div>
    </ToastProvider>
  );
};

const BasicToastExample: React.FC = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Success!',
      description: 'Your changes have been saved.',
    });
  };

  return (
    <Button onClick={showToast}>
      Show Toast
    </Button>
  );
};

// Toast variants demo
export const ToastVariantsDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <ToastVariantsExample />
      </div>
    </ToastProvider>
  );
};

const ToastVariantsExample: React.FC = () => {
  const { toast } = useToast();

  const showDefault = () => {
    toast({
      title: 'Information',
      description: 'This is a default toast notification.',
    });
  };

  const showSuccess = () => {
    toast({
      title: 'Success!',
      description: 'Your operation completed successfully.',
      variant: 'success',
    });
  };

  const showWarning = () => {
    toast({
      title: 'Warning',
      description: 'Please check your input before continuing.',
      variant: 'warning',
    });
  };

  const showError = () => {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive',
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={showDefault} variant="ghost" size="sm">
        Default
      </Button>
      <Button onClick={showSuccess} variant="ghost" size="sm">
        Success
      </Button>
      <Button onClick={showWarning} variant="ghost" size="sm">
        Warning
      </Button>
      <Button onClick={showError} variant="ghost" size="sm">
        Error
      </Button>
    </div>
  );
};

// Toast with actions demo
export const ToastWithActionsDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <ToastWithActionsExample />
      </div>
    </ToastProvider>
  );
};

const ToastWithActionsExample: React.FC = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Update Available',
      description: 'A new version of the app is ready to install.',
      action: {
        label: 'Update',
        onClick: () => console.log('Update clicked!')
      }
    });
  };

  return (
    <Button onClick={showToast}>
      Show Toast with Action
    </Button>
  );
};

// Multiple stacked toasts demo
export const StackedToastsDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <StackedToastsExample />
      </div>
    </ToastProvider>
  );
};

const StackedToastsExample: React.FC = () => {
  const { toast } = useToast();

  const showMultiple = () => {
    toast({
      title: 'First Toast',
      description: 'This is the first notification.',
    });
    
    setTimeout(() => {
      toast({
        title: 'Second Toast',
        description: 'This is the second notification.',
        variant: 'success',
      });
    }, 500);
    
    setTimeout(() => {
      toast({
        title: 'Third Toast',
        description: 'This is the third notification.',
        variant: 'warning',
      });
    }, 1000);
    
    setTimeout(() => {
      toast({
        title: 'Fourth Toast',
        description: 'This will push the first one out!',
        variant: 'destructive',
      });
    }, 1500);
  };

  return (
    <Button onClick={showMultiple} variant="secondary">
      Show Multiple Toasts
    </Button>
  );
};

// Persistent toast demo
export const PersistentToastDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <PersistentToastExample />
      </div>
    </ToastProvider>
  );
};

const PersistentToastExample: React.FC = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Important Notice',
      description: 'This toast will remain visible until manually closed.',
      duration: 0, // Persistent
    });
  };

  return (
    <Button onClick={showToast} variant="secondary">
      Show Persistent Toast
    </Button>
  );
};

// Custom duration demo
export const CustomDurationDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <CustomDurationExample />
      </div>
    </ToastProvider>
  );
};

const CustomDurationExample: React.FC = () => {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: 'Quick Toast',
      description: 'This toast will close in 2 seconds.',
      duration: 2000,
    });
  };

  return (
    <Button onClick={showToast} variant="ghost">
      Show Quick Toast (2s)
    </Button>
  );
};

// Dismiss all demo
export const DismissAllDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <DismissAllExample />
      </div>
    </ToastProvider>
  );
};

const DismissAllExample: React.FC = () => {
  const { toast, dismissAll } = useToast();

  const showMultiple = () => {
    toast({ title: 'Toast 1', description: 'First notification' });
    toast({ title: 'Toast 2', description: 'Second notification', variant: 'success' });
    toast({ title: 'Toast 3', description: 'Third notification', variant: 'warning' });
  };

  return (
    <div className="flex gap-3">
      <Button onClick={showMultiple} variant="secondary" size="sm">
        Show Multiple
      </Button>
      <Button onClick={dismissAll} variant="ghost" size="sm">
        Dismiss All
      </Button>
    </div>
  );
};

// Toast positions demo
export const ToastPositionsDemo: React.FC = () => {
  return (
    <ToastProvider>
      <div className="my-6">
        <ToastPositionsExample />
      </div>
    </ToastProvider>
  );
};

const ToastPositionsExample: React.FC = () => {
  const { toast } = useToast();

  const positions = [
    { key: 'top-left', label: 'Top Left' },
    { key: 'top-center', label: 'Top Center' },
    { key: 'top-right', label: 'Top Right' },
    { key: 'bottom-left', label: 'Bottom Left' },
    { key: 'bottom-center', label: 'Bottom Center' },
    { key: 'bottom-right', label: 'Bottom Right' }
  ];

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        Click the buttons to see toasts appear in different positions:
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-md">
        {positions.map((position) => (
          <Button
            key={position.key}
            onClick={() => toast({
              title: position.label,
              description: `Toast positioned at ${position.key}`,
              position: position.key as ToastPosition,
              variant: 'default'
            })}
            variant="secondary"
            size="sm"
          >
            {position.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
        <strong>Available positions:</strong> top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
      </div>
    </div>
  );
}; 