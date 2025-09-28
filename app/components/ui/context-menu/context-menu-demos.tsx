'use client'

import {
  ArchiveIcon,
  BookmarkIcon,
  ClipboardIcon,
  CopyIcon,
  EyeOpenIcon,
  FileIcon,
  FileTextIcon,
  GearIcon,
  ImageIcon,
  InfoCircledIcon,
  Pencil1Icon,
  PlusIcon,
  ScissorsIcon,
  Share1Icon,
  StackIcon,
  TableIcon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons'
import type React from 'react'
import { useState } from 'react'
import { buttonVariants } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu'

export const BasicContextMenuDemo: React.FC = () => {
  const [lastAction, setLastAction] = useState<string>('')

  return (
    <div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
      <div className="text-foreground-muted text-center text-sm">
        Right-click on the area below to open the context menu
      </div>

      <ContextMenu>
        <ContextMenuTrigger
          className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
        >
          Right-click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setLastAction('Cut')}>
            <ScissorsIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Cut
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setLastAction('Copy')}>
            <CopyIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setLastAction('Paste')}>
            <ClipboardIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Paste
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {lastAction && (
        <div className="text-foreground-muted text-center text-sm">
          Last action: <span className="font-medium">{lastAction}</span>
        </div>
      )}
    </div>
  )
}

export const ContextMenuWithSeparatorDemo: React.FC = () => {
  return (
    <div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
      <div className="text-foreground-muted text-center text-sm">
        Context menu with separators
      </div>

      <ContextMenu>
        <ContextMenuTrigger
          className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
        >
          Right-click for menu with separators
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Pencil1Icon aria-hidden="true" className="mr-2 h-4 w-4" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <StackIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Duplicate
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <BookmarkIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Bookmark
          </ContextMenuItem>
          <ContextMenuItem>
            <Share1Icon aria-hidden="true" className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem destructive>
            <TrashIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export const ContextMenuWithSubmenuDemo: React.FC = () => {
  return (
    <div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
      <div className="text-foreground-muted text-center text-sm">
        Context menu with submenu
      </div>

      <ContextMenu>
        <ContextMenuTrigger
          className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
        >
          Right-click for submenu example
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            New
          </ContextMenuItem>

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <UploadIcon aria-hidden="true" className="mr-2 h-4 w-4" />
              Export As
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>
                <FileTextIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                PDF
              </ContextMenuItem>
              <ContextMenuItem>
                <TableIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Excel
              </ContextMenuItem>
              <ContextMenuItem>
                <ImageIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Image
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <GearIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            Settings
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export const DisabledContextMenuDemo: React.FC = () => {
  return (
    <div className="my-6 flex w-full max-w-md flex-col items-center justify-center space-y-4">
      <div className="text-foreground-muted text-center text-sm">
        Disabled context menu and items
      </div>

      <div className="space-y-4">
        <ContextMenu>
          <ContextMenuTrigger
            disabled
            className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
          >
            Context menu disabled
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>This won't show</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <ContextMenu>
          <ContextMenuTrigger
            className={cn(buttonVariants({ variant: 'secondary', size: 'md' }))}
          >
            Some items disabled
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Available Item</ContextMenuItem>
            <ContextMenuItem disabled>Disabled Item</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Another Available Item</ContextMenuItem>
            <ContextMenuItem disabled>Another Disabled Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  )
}

export const FileContextMenuDemo: React.FC = () => {
  const [files] = useState([
    { name: 'document.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'image.jpg', type: 'image', size: '1.8 MB' },
    { name: 'project.zip', type: 'archive', size: '15.2 MB' },
  ])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <FileTextIcon
            aria-hidden="true"
            className="text-foreground-subtle mr-3 h-5 w-5"
          />
        )
      case 'image':
        return (
          <ImageIcon
            aria-hidden="true"
            className="text-foreground-subtle mr-3 h-5 w-5"
          />
        )
      case 'archive':
        return (
          <ArchiveIcon
            aria-hidden="true"
            className="text-foreground-subtle mr-3 h-5 w-5"
          />
        )
      default:
        return (
          <FileIcon
            aria-hidden="true"
            className="text-foreground-subtle mr-3 h-5 w-5"
          />
        )
    }
  }

  return (
    <div className="mx-auto my-6 w-full max-w-md space-y-4">
      <div className="text-foreground-muted text-center text-sm">
        File manager context menu example
      </div>

      <div className="flex flex-col space-y-2">
        {files.map((file, index) => (
          <ContextMenu key={index}>
            <ContextMenuTrigger>
              <div className="border-border bg-background flex cursor-context-menu items-center gap-3 rounded-md border border-none p-3 transition-all duration-200 ease-in-out dark:border-solid">
                {getFileIcon(file.type)}
                <div className="min-w-0 flex-1">
                  <div className="text-foreground truncate text-sm font-medium">
                    {file.name}
                  </div>
                  <div className="text-foreground-subtle text-xs">
                    {file.size}
                  </div>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <EyeOpenIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Open
              </ContextMenuItem>
              <ContextMenuItem>
                <Pencil1Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <CopyIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Copy
              </ContextMenuItem>
              <ContextMenuItem>
                <Share1Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                Share
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <InfoCircledIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Properties
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  )
}
