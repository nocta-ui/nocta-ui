'use client';

import React from 'react';
import { Alert, AlertTitle, AlertDescription, AlertIcon } from './alert';

export const DefaultAlertDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Alert>
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is a default alert with an information message.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const SimpleAlertDemo: React.FC = () => {
  return (
    <div className="my-6">
      <Alert>
        <AlertDescription>
          A simple alert without title or icon.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const VariantsDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      <Alert variant="default">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is the default variant for general information.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Please review your settings before proceeding.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const AlertWithoutIconsDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      <Alert variant="default">
        <AlertTitle>System Maintenance</AlertTitle>
        <AlertDescription>
          We will be performing scheduled maintenance on Sunday at 2:00 AM UTC.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTitle>Account Suspended</AlertTitle>
        <AlertDescription>
          Your account has been temporarily suspended. Contact support for assistance.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const FormValidationDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      <Alert variant="destructive">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Validation Error</AlertTitle>
        <AlertDescription>
          Please fix the following errors:
          <ul className="mt-2 list-disc list-inside">
            <li>Email address is required</li>
            <li>Password must be at least 8 characters</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Form Submitted</AlertTitle>
        <AlertDescription>
          Thank you! Your form has been submitted successfully.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const SystemNotificationsDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      <Alert variant="warning">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </AlertIcon>
        <AlertTitle>Storage Almost Full</AlertTitle>
        <AlertDescription>
          You are using 95% of your storage quota. Consider upgrading your plan or deleting old files.
        </AlertDescription>
      </Alert>

      <Alert variant="default">
        <AlertIcon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m6 0H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          </svg>
        </AlertIcon>
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription>
          Check out our new dashboard analytics feature in the Settings panel.
        </AlertDescription>
      </Alert>
    </div>
  );
}; 