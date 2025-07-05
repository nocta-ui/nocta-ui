'use client';

import React, { useState } from 'react';
import { Switch } from './switch';

export const BasicSwitchDemo: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  
  return <Switch checked={isChecked} onCheckedChange={setIsChecked} />;
};

export const ControlledSwitchDemo: React.FC = () => {
  return <Switch checked={true} onCheckedChange={() => {}} />;
};

export const VariantsDemo: React.FC = () => {
  const [states, setStates] = useState({
    default: true,
    success: true,
    warning: true,
    destructive: true,
  });

  const handleChange = (variant: keyof typeof states) => (checked: boolean) => {
    setStates(prev => ({ ...prev, [variant]: checked }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch 
          variant="default"
          checked={states.default} 
          onCheckedChange={handleChange('default')}
        />
        <span className="text-sm">Default</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch 
          variant="success" 
          checked={states.success} 
          onCheckedChange={handleChange('success')}
        />
        <span className="text-sm">Success</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch 
          variant="warning" 
          checked={states.warning} 
          onCheckedChange={handleChange('warning')}
        />
        <span className="text-sm">Warning</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch 
          variant="destructive" 
          checked={states.destructive} 
          onCheckedChange={handleChange('destructive')}
        />
        <span className="text-sm">Destructive</span>
      </div>
    </div>
  );
};

export const SizesDemo: React.FC = () => {
  const [states, setStates] = useState({
    sm: true,
    md: true,
    lg: true,
  });

  const handleChange = (size: keyof typeof states) => (checked: boolean) => {
    setStates(prev => ({ ...prev, [size]: checked }));
  };

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch 
          size="sm" 
          checked={states.sm} 
          onCheckedChange={handleChange('sm')}
        />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          size="md" 
          checked={states.md} 
          onCheckedChange={handleChange('md')}
        />
        <span className="text-sm">Medium</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          size="lg" 
          checked={states.lg} 
          onCheckedChange={handleChange('lg')}
        />
        <span className="text-sm">Large</span>
      </div>
    </div>
  );
};

export const DisabledStateDemo: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center gap-3">
        <Switch disabled={false} />
        <span className="text-sm">Enabled (off)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={true} disabled={false} />
        <span className="text-sm">Enabled (on)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled={true} />
        <span className="text-sm">Disabled (off)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={true} disabled={true} />
        <span className="text-sm">Disabled (on)</span>
      </div>
    </div>
  );
};

export const CustomStylingDemo: React.FC = () => {
  const [states, setStates] = useState({
    scaled: true,
    opacity: true,
    rounded: false,
  });

  const handleChange = (type: keyof typeof states) => (checked: boolean) => {
    setStates(prev => ({ ...prev, [type]: checked }));
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Switch 
          className="scale-125" 
          checked={states.scaled}
          onCheckedChange={handleChange('scaled')}
        />
        <span className="text-sm">Scaled (1.25x)</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          className="opacity-75" 
          checked={states.opacity}
          onCheckedChange={handleChange('opacity')}
        />
        <span className="text-sm">75% Opacity</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          className="rounded-sm" 
          checked={states.rounded}
          onCheckedChange={handleChange('rounded')}
        />
        <span className="text-sm">Square corners</span>
      </div>
    </div>
  );
};