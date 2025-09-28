'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React, { useCallback, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Icons } from '@/app/components/ui/icons/icons'
import { Spinner } from '@/app/components/ui/spinner'

import { cn } from '@/lib/utils'

const fileUploadVariants = cva(
  [
    'relative transition-all duration-200 ease-in-out',
    'focus-within:outline-none focus-within:ring-1 focus-within:ring-offset-1',
    'focus-within:ring-offset-ring-offset/50',
    'focus-within:ring-ring/50',
    'rounded-lg',
  ],
  {
    variants: {
      variant: {
        default: [
          'border border-none dark:border-solid border-border shadow-md',
          'bg-background',
        ],
      },
      size: {
        sm: 'p-4 w-sm',
        md: 'p-6 w-md',
        lg: 'p-8 w-lg',
      },
      state: {
        idle: '',
        dragover: ['border-background-subtle', 'bg-background', 'scale-[1.02]'],
        error: ['border-error/40', 'bg-red-50 dark:bg-red-900/20'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'idle',
    },
  }
)

const fileItemVariants = cva(
  ['flex items-center gap-3 p-3 rounded-lg border', 'border-border'],
  {
    variants: {
      status: {
        pending: 'bg-background',
        uploading: 'bg-background',
        success: 'bg-success/10 border-success/40',
        error: 'bg-error/10 border-error/40',
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'md',
    },
  }
)

export interface FileUploadFile {
  id: string
  file: File
  preview?: string
  progress?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export interface FileUploadProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'>,
    VariantProps<typeof fileUploadVariants> {
  multiple?: boolean
  accept?: string
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  files?: FileUploadFile[]
  onFilesChange?: (files: FileUploadFile[]) => void
  onUpload?: (files: FileUploadFile[]) => Promise<void>
  showProgress?: boolean
  showPreview?: boolean
  uploadText?: string
  dragText?: string
  className?: string
}

export interface FileUploadZoneProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
  onFilesSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export interface FileUploadItemProps {
  file: FileUploadFile
  showPreview?: boolean
  onRemove?: (id: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface FileUploadProgressProps {
  progress: number
  className?: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

const createFilePreview = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelect,
  accept,
  multiple = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelect(files)
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'w-full cursor-pointer focus-visible:ring-0 focus-visible:outline-none',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={handleClick}
      aria-label={multiple ? 'Select files to upload' : 'Select file to upload'}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileInput}
        className="sr-only"
      />
      {children}
    </button>
  )
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  progress,
  className,
}) => {
  return (
    <div
      className={cn('bg-background-muted h-2 w-full rounded-full', className)}
    >
      <div
        className="bg-foreground h-2 rounded-full transition-all duration-200 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  file,
  showPreview = true,
  onRemove,
  size = 'md',
  className,
}) => {
  const handleRemove = () => {
    onRemove?.(file.id)
  }

  const isUploading =
    file.status === 'uploading' && typeof file.progress === 'number'

  return (
    <li
      className={cn(fileItemVariants({ status: file.status, size }), className)}
    >
      <div className="flex-shrink-0">
        {showPreview && file.preview ? (
          /* biome-ignore lint/performance/noImgElement: prefer native img here */
          <img
            src={file.preview}
            alt={file.file.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center">
            <Icons.FileUpload aria-hidden="true" className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
            {file.file.name}
          </p>
          {onRemove && (
            <Button
              className="text-foreground-subtle hover:text-foreground-muted hover:bg-background focus-visible:ring-offset-ring-offset/50 not-prose focus-visible:ring-ring/50 focus-visible:border-border size-6 cursor-pointer transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none"
              variant="icon"
              onClick={handleRemove}
              aria-label={`Remove ${file.file.name}`}
            >
              <Icons.X aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-1 flex min-w-0 items-center gap-2">
          <p className="text-foreground-muted flex-shrink-0 text-xs">
            {formatFileSize(file.file.size)}
          </p>

          {file.status === 'error' && file.error && (
            <p className="text-error/90 truncate text-xs">{file.error}</p>
          )}

          {file.status === 'success' && (
            <span className="text-success/90 flex flex-shrink-0 items-center gap-1 text-xs">
              <Icons.Check aria-hidden="true" className="h-3 w-3" />
              Uploaded
            </span>
          )}
        </div>

        <div className="mt-2 h-2">
          <div
            className={cn(
              'transition-opacity duration-200',
              isUploading ? 'opacity-100' : 'opacity-0'
            )}
          >
            <FileUploadProgress progress={file.progress || 0} />
          </div>
        </div>
      </div>
    </li>
  )
}

export const FileUpload: React.FC<FileUploadProps> = ({
  variant = 'default',
  size = 'md',
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  disabled = false,
  files = [],
  onFilesChange,
  onUpload,
  showPreview = true,
  uploadText = 'Click to upload or drag and drop',
  dragText = 'Drop files here',
  className,
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragState, setDragState] = useState<'idle' | 'dragover' | 'error'>(
    'idle'
  )

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`
      }

      if (accept) {
        const acceptedTypes = accept.split(',').map((type) => type.trim())
        const isValidType = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          return file.type.match(type.replace('*', '.*'))
        })

        if (!isValidType) {
          return `File type not accepted. Accepted types: ${accept}`
        }
      }

      return null
    },
    [maxSize, accept]
  )

  const handleFilesSelect = useCallback(
    async (newFiles: File[]) => {
      const validFiles: FileUploadFile[] = []

      for (const file of newFiles) {
        if (maxFiles && files.length + validFiles.length >= maxFiles) {
          break
        }

        const error = validateFile(file)
        const preview = showPreview ? await createFilePreview(file) : undefined

        const fileUpload: FileUploadFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: preview || undefined,
          status: error ? 'error' : 'pending',
          error: error || undefined,
        }

        validFiles.push(fileUpload)
      }

      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
      onFilesChange?.(updatedFiles)

      setDragState('idle')
      setIsDragOver(false)
    },
    [files, maxFiles, validateFile, multiple, showPreview, onFilesChange]
  )

  const handleRemoveFile = useCallback(
    (id: string) => {
      const updatedFiles = files.filter((file) => file.id !== id)
      onFilesChange?.(updatedFiles)
    },
    [files, onFilesChange]
  )

  const handleUpload = useCallback(async () => {
    if (!onUpload) return

    const pendingFiles = files.filter((file) => file.status === 'pending')
    if (pendingFiles.length === 0) return

    const updatedFiles = files.map((file) =>
      file.status === 'pending'
        ? { ...file, status: 'uploading' as const, progress: 0 }
        : file
    )
    onFilesChange?.(updatedFiles)

    try {
      await onUpload(pendingFiles)

      const successFiles = updatedFiles.map((file) =>
        file.status === 'uploading'
          ? { ...file, status: 'success' as const, progress: 100 }
          : file
      )
      onFilesChange?.(successFiles)
    } catch {
      const errorFiles = updatedFiles.map((file) =>
        file.status === 'uploading'
          ? { ...file, status: 'error' as const, error: 'Upload failed' }
          : file
      )
      onFilesChange?.(errorFiles)
    }
  }, [files, onUpload, onFilesChange])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
      setDragState('dragover')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      setDragState('idle')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFilesSelect(droppedFiles)
  }

  const state = disabled ? 'idle' : dragState
  const hasFiles = files.length > 0
  const pendingFiles = files.filter((file) => file.status === 'pending')
  const uploadingFiles = files.filter((file) => file.status === 'uploading')
  const isUploading = uploadingFiles.length > 0

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <section
        aria-label="File upload dropzone"
        className={cn(fileUploadVariants({ variant, size, state }))}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FileUploadZone
          onFilesSelect={handleFilesSelect}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-3">
              <Icons.FileUpload
                aria-hidden="true"
                className={cn(
                  'mx-auto transition-colors',
                  size === 'sm'
                    ? 'h-6 w-6'
                    : size === 'lg'
                      ? 'h-10 w-10'
                      : 'h-8 w-8',
                  isDragOver
                    ? 'text-foreground-subtle'
                    : 'text-foreground-subtle'
                )}
              />
            </div>

            <div className="text-sm">
              <p
                className={cn(
                  'font-medium',
                  isDragOver
                    ? 'text-foreground-subtle'
                    : 'text-foreground-muted'
                )}
              >
                {isDragOver ? dragText : uploadText}
              </p>
              {!isDragOver && (
                <div className="mt-1 space-y-1">
                  {accept && (
                    <p className="text-foreground-subtle text-xs">
                      Accepted types: {accept}
                    </p>
                  )}
                  {maxSize && (
                    <p className="text-foreground-subtle text-xs">
                      Max size: {formatFileSize(maxSize)}
                    </p>
                  )}
                  {multiple && maxFiles && (
                    <p className="text-foreground-subtle text-xs">
                      Max files: {maxFiles}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </FileUploadZone>
      </section>

      {hasFiles && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-foreground text-sm font-medium">
              Files ({files.length}
              {maxFiles ? `/${maxFiles}` : ''})
            </h4>
            {(pendingFiles.length > 0 || isUploading) && onUpload && (
              <Button
                onClick={handleUpload}
                size="sm"
                variant="ghost"
                className="bg-foreground text-background hover:bg-foreground-muted hover:text-background/80 transition-colors duration-200"
                disabled={disabled || isUploading}
              >
                {isUploading && <Spinner size="sm" variant="default" />}
                {isUploading
                  ? `Uploading ${uploadingFiles.length} file${uploadingFiles.length > 1 ? 's' : ''}...`
                  : `Upload ${pendingFiles.length} file${pendingFiles.length > 1 ? 's' : ''}`}
              </Button>
            )}
          </div>

          <ul className="max-h-60 space-y-2 overflow-y-auto">
            {files.map((file) => (
              <FileUploadItem
                key={file.id}
                file={file}
                showPreview={showPreview}
                onRemove={handleRemoveFile}
                size={size || 'md'}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
