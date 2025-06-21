'use client';

import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button } from '../button';
import { Badge } from '../badge';

export const SimpleTooltipDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          This is a helpful tooltip!
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const WithTextTriggerDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center">
      <div className="text-center">
        <span>
          This text has a 
          <Tooltip>
            <TooltipTrigger className="underline decoration-dotted underline-offset-4 cursor-help mx-1">
              tooltip
            </TooltipTrigger>
            <TooltipContent>
              Additional context information
            </TooltipContent>
          </Tooltip>
          that explains more.
        </span>
      </div>
    </div>
  );
};

export const PositioningDemo: React.FC = () => {
  return (
    <div className="my-6">
      <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost">Top</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Tooltip on top
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Tooltip on bottom
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              Tooltip on left
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Tooltip on right
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export const AlignmentDemo: React.FC = () => {
  return (
    <div className="my-6">
      <div className="flex justify-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary">Start</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            Aligned to start
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary">Center</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Aligned to center
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary">End</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            Aligned to end
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export const RichContentDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="primary">Features</Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <div className="font-medium">Premium Features</div>
            <div className="text-xs opacity-90">
              • Advanced analytics<br/>
              • Priority support<br/>
              • Custom integrations
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="py-0 px-2.5 rounded-md" variant="success">New</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-medium">Recently Added</div>
            <div className="text-xs opacity-90 mt-1">
              This feature was added in v2.1
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const DelayDurationDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center gap-4">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button size="sm" variant="ghost">Instant</Button>
        </TooltipTrigger>
        <TooltipContent>
          Appears immediately
        </TooltipContent>
      </Tooltip>
      
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button size="sm" variant="ghost">Slow</Button>
        </TooltipTrigger>
        <TooltipContent>
          Appears after 1 second
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const WithoutArrowDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">No Arrow</Button>
        </TooltipTrigger>
        <TooltipContent showArrow={false}>
          Tooltip without arrow
        </TooltipContent>
      </Tooltip>
    </div>
  );
}; 