'use client'

import type React from 'react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export const BasicPopoverDemo: React.FC = () => {
  return (
    <div className="my-6 flex justify-center">
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-medium">About this feature</h4>
            <p className="text-foreground-muted text-sm">
              This is a popover component that can contain any content you want.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const ControlledDemo: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="my-6 space-y-4">
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-success/10 border-success/40 text-success/90 rounded border px-3 py-1 text-sm duration-200 ease-in-out hover:opacity-80"
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-error/10 border-error/40 text-error/80 rounded border px-3 py-1 text-sm duration-200 ease-in-out hover:opacity-80"
        >
          Close
        </button>
        <span className="bg-background text-foreground rounded px-3 py-1 text-sm">
          State: {open ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="flex justify-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>Controlled Popover</PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col space-y-2">
              <h4 className="text-sm font-medium">Controlled State</h4>
              <p className="text-foreground-muted text-sm">
                This popover&apos;s state is controlled externally.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-background hover:bg-foreground-muted/10 rounded px-2 py-1 text-xs duration-200 ease-in-out"
              >
                Close from inside
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
