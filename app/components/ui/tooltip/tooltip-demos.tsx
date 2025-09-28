'use client'

import type React from 'react'
import { Button } from '../button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export const SimpleTooltipDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center">
      <Tooltip>
        <TooltipTrigger>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>This is a helpful tooltip!</TooltipContent>
      </Tooltip>
    </div>
  )
}

export const WithTextTriggerDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center">
      <div className="text-center">
        <span>
          This text has a
          <Tooltip>
            <TooltipTrigger className="mx-1 cursor-help underline decoration-dotted underline-offset-4">
              tooltip
            </TooltipTrigger>
            <TooltipContent>Additional context information</TooltipContent>
          </Tooltip>
          that explains more.
        </span>
      </div>
    </div>
  )
}

export const DelayDurationDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center gap-4">
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <Button size="sm" variant="ghost">
            Instant
          </Button>
        </TooltipTrigger>
        <TooltipContent>Appears immediately</TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={1000}>
        <TooltipTrigger>
          <Button size="sm" variant="ghost">
            Slow
          </Button>
        </TooltipTrigger>
        <TooltipContent>Appears after 1 second</TooltipContent>
      </Tooltip>
    </div>
  )
}
