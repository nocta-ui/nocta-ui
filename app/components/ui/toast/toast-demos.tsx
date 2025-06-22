'use client';

import React, { useState } from 'react';
import { Toast, ToastHeader, ToastTitle, ToastDescription, ToastActions, ToastClose } from './toast';
import { Button } from '../button';

export const BasicToastDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="my-6">
      <Button onClick={() => setShowToast(true)}>
        Show Toast
      </Button>
      
      {showToast && (
        <Toast onClose={() => setShowToast(false)}>
          <div className="px-6 py-4">
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>Your changes have been saved.</ToastDescription>
          </div>
          <ToastClose onClose={() => setShowToast(false)} />
        </Toast>
      )}
    </div>
  );
};

export const MultipleToastsDemo: React.FC = () => {
  const [toasts, setToasts] = useState<{[key: string]: boolean}>({});

  const showToast = (id: string) => {
    setToasts(prev => ({ ...prev, [id]: true }));
  };

  const hideToast = (id: string) => {
    setToasts(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="my-6 space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => showToast('info')}>Info Toast</Button>
        <Button variant="secondary" onClick={() => showToast('success')}>Success Toast</Button>
        <Button variant="secondary" onClick={() => showToast('warning')}>Warning Toast</Button>
        <Button variant="secondary" onClick={() => showToast('error')}>Error Toast</Button>
      </div>
      
      {toasts.info && (
        <Toast onClose={() => hideToast('info')}>
          <div className="px-6 py-4">
            <ToastTitle>Information</ToastTitle>
            <ToastDescription>This is an informational message.</ToastDescription>
          </div>
          <ToastClose onClose={() => hideToast('info')} />
        </Toast>
      )}
      
      {toasts.success && (
        <Toast onClose={() => hideToast('success')}>
          <div className="px-6 py-4">
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>Operation completed successfully.</ToastDescription>
          </div>
          <ToastClose onClose={() => hideToast('success')} />
        </Toast>
      )}
      
      {toasts.warning && (
        <Toast onClose={() => hideToast('warning')}>
          <div className="px-6 py-4">
            <ToastTitle>Warning</ToastTitle>
            <ToastDescription>Please check your input before proceeding.</ToastDescription>
          </div>
          <ToastClose onClose={() => hideToast('warning')} />
        </Toast>
      )}
      
      {toasts.error && (
        <Toast onClose={() => hideToast('error')}>
          <div className="px-6 py-4">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Something went wrong. Please try again.</ToastDescription>
          </div>
          <ToastClose onClose={() => hideToast('error')} />
        </Toast>
      )}
    </div>
  );
};

export const WithActionsDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="my-6">
      <Button onClick={() => setShowToast(true)}>
        Show Toast with Actions
      </Button>
      
      {showToast && (
        <Toast onClose={() => setShowToast(false)}>
          <div className="px-6 py-4">
            <ToastTitle>Confirmation Required</ToastTitle>
            <ToastDescription>Are you sure you want to delete this item?</ToastDescription>
          </div>
          <ToastActions>
            <Button variant="ghost" size="sm" onClick={() => setShowToast(false)}>
              Cancel
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowToast(false)}>
              Delete
            </Button>
          </ToastActions>
          <ToastClose onClose={() => setShowToast(false)} />
        </Toast>
      )}
    </div>
  );
};

export const WithHeaderDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="my-6">
      <Button onClick={() => setShowToast(true)}>
        Show Toast with Header
      </Button>
      
      {showToast && (
        <Toast onClose={() => setShowToast(false)}>
          <ToastHeader>
            <ToastTitle>Upload Complete</ToastTitle>
            <ToastDescription>3 files uploaded successfully</ToastDescription>
          </ToastHeader>
          <div className="px-6 py-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between mb-1">
                <span>document.pdf</span>
                <span>2.4 MB</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>image.jpg</span>
                <span>1.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span>data.xlsx</span>
                <span>3.1 MB</span>
              </div>
            </div>
          </div>
          <ToastClose onClose={() => setShowToast(false)} />
        </Toast>
      )}
    </div>
  );
};

export const AutoCloseDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="my-6">
      <Button onClick={() => setShowToast(true)}>
        Show Auto-Close Toast (3s)
      </Button>
      
      {showToast && (
        <Toast 
          duration={3000} 
          onClose={() => setShowToast(false)}
        >
          <div className="px-6 py-4">
            <ToastTitle>Auto-Close Toast</ToastTitle>
            <ToastDescription>This toast will close automatically in 3 seconds.</ToastDescription>
          </div>
        </Toast>
      )}
    </div>
  );
};

export const PersistentToastDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="my-6">
      <Button onClick={() => setShowToast(true)}>
        Show Persistent Toast
      </Button>
      
      {showToast && (
        <Toast 
          duration={0} 
          onClose={() => setShowToast(false)}
        >
          <div className="px-6 py-4">
            <ToastTitle>Important Notice</ToastTitle>
            <ToastDescription>This toast will stay visible until manually closed.</ToastDescription>
          </div>
          <ToastClose onClose={() => setShowToast(false)} />
        </Toast>
      )}
    </div>
  );
}; 