'use client';

import React, { useCallback, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from '@/app/components/ui/spinner';

const fileUploadVariants = cva(
  [
    'relative transition-all duration-200 ease-in-out',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
    'focus-within:ring-offset-white/50 dark:focus-within:ring-offset-nocta-900/50',
    'focus-within:ring-nocta-900/50 dark:focus-within:ring-nocta-100/50',
    'rounded-lg'
  ],
  {
    variants: {
      variant: {
        default: [
          'border-2 border-dashed border-nocta-300 dark:border-nocta-700',
          'hover:border-nocta-400 dark:hover:border-nocta-600',
          'bg-white dark:bg-nocta-900'
        ]
      },
      size: {
        sm: 'p-4 w-sm',
        md: 'p-6 w-md',
        lg: 'p-8 w-lg'
      },
      state: {
        idle: '',
        dragover: [
          'border-nocta-500 dark:border-nocta-400',
          'bg-nocta-100 dark:bg-nocta-800',
          'scale-[1.02]'
        ],
        error: [
          'border-red-300 dark:border-red-700',
          'bg-red-50 dark:bg-red-900/20'
        ]
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'idle'
    }
  }
);

const fileItemVariants = cva(
  [
    'flex items-center gap-3 p-3 rounded-lg border',
    'border-nocta-200 dark:border-nocta-700',
    'bg-white dark:bg-nocta-800/50'
  ],
  {
    variants: {
      status: {
        pending: 'bg-nocta-50 dark:bg-nocta-800/30',
        uploading: 'bg-nocta-50 dark:bg-nocta-800/30',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
      }
    },
    defaultVariants: {
      status: 'pending',
      size: 'md'
    }
  }
);

export interface FileUploadFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'>,
    VariantProps<typeof fileUploadVariants> {
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  files?: FileUploadFile[];
  onFilesChange?: (files: FileUploadFile[]) => void;
  onUpload?: (files: FileUploadFile[]) => Promise<void>;
  showProgress?: boolean;
  showPreview?: boolean;
  uploadText?: string;
  dragText?: string;
  className?: string;
}

export interface FileUploadZoneProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  onFilesSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface FileUploadItemProps {
  file: FileUploadFile;
  showPreview?: boolean;
  onRemove?: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface FileUploadProgressProps {
  progress: number;
  className?: string;
}

const FileIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const createFilePreview = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelect,
  accept,
  multiple = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelect(files);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={cn('cursor-pointer', disabled && 'cursor-not-allowed opacity-50', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  progress,
  className
}) => {
  return (
    <div className={cn('w-full bg-nocta-200 dark:bg-nocta-700 rounded-full h-2', className)}>
      <div
        className="bg-nocta-900 dark:bg-nocta-100/50 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  file,
  showPreview = true,
  onRemove,
  size = 'md',
  className
}) => {
  const handleRemove = () => {
    onRemove?.(file.id);
  };

  const isUploading = file.status === 'uploading' && typeof file.progress === 'number';

  return (
    <div className={cn(fileItemVariants({ status: file.status, size }), className)}>
      <div className="flex-shrink-0">
        {showPreview && file.preview ? (
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center text-nocta-500 dark:text-nocta-400">
            <FileIcon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-nocta-900 dark:text-nocta-100 truncate flex-1 min-w-0">
            {file.file.name}
          </p>
          {onRemove && (
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-1 text-nocta-500 hover:text-nocta-700 dark:text-nocta-400 dark:hover:text-nocta-200 transition-colors"
              aria-label={`Remove ${file.file.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1 min-w-0">
          <p className="text-xs text-nocta-600 dark:text-nocta-400 flex-shrink-0">
            {formatFileSize(file.file.size)}
          </p>
          
          {file.status === 'error' && file.error && (
            <p className="text-xs text-red-600 dark:text-red-400 truncate">
              {file.error}
            </p>
          )}
          
          {file.status === 'success' && (
            <span className="text-xs text-green-600 dark:text-green-400 flex-shrink-0 flex items-center gap-1">
              <CheckIcon className="w-3 h-3" />
              Uploaded
            </span>
          )}
        </div>

        <div className="mt-2 h-2">
          <div className={cn(
            "transition-opacity duration-200",
            isUploading ? "opacity-100" : "opacity-0"
          )}>
            <FileUploadProgress progress={file.progress || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragState, setDragState] = useState<'idle' | 'dragover' | 'error'>('idle');

  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });
      
      if (!isValidType) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }
    
    return null;
  }, [maxSize, accept]);

  const handleFilesSelect = useCallback(async (newFiles: File[]) => {
    const validFiles: FileUploadFile[] = [];
    
    for (const file of newFiles) {
      if (maxFiles && files.length + validFiles.length >= maxFiles) {
        break;
      }
      
      const error = validateFile(file);
      const preview = showPreview ? await createFilePreview(file) : undefined;
      
      const fileUpload: FileUploadFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: preview || undefined,
        status: error ? 'error' : 'pending',
        error: error || undefined
      };
      
      validFiles.push(fileUpload);
    }
    
    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    onFilesChange?.(updatedFiles);
    
    setDragState('idle');
    setIsDragOver(false);
  }, [files, maxFiles, validateFile, multiple, showPreview, onFilesChange]);

  const handleRemoveFile = useCallback((id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    onFilesChange?.(updatedFiles);
  }, [files, onFilesChange]);

  const handleUpload = useCallback(async () => {
    if (!onUpload) return;
    
    const pendingFiles = files.filter(file => file.status === 'pending');
    if (pendingFiles.length === 0) return;
    
    const updatedFiles = files.map(file => 
      file.status === 'pending' 
        ? { ...file, status: 'uploading' as const, progress: 0 }
        : file
    );
    onFilesChange?.(updatedFiles);
    
    try {
      await onUpload(pendingFiles);
      
      const successFiles = updatedFiles.map(file => 
        file.status === 'uploading' 
          ? { ...file, status: 'success' as const, progress: 100 }
          : file
      );
      onFilesChange?.(successFiles);
    } catch {
      const errorFiles = updatedFiles.map(file => 
        file.status === 'uploading' 
          ? { ...file, status: 'error' as const, error: 'Upload failed' }
          : file
      );
      onFilesChange?.(errorFiles);
    }
  }, [files, onUpload, onFilesChange]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
      setDragState('dragover');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragState('idle');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesSelect(droppedFiles);
  };

  const state = disabled ? 'idle' : dragState;
  const hasFiles = files.length > 0;
  const pendingFiles = files.filter(file => file.status === 'pending');
  const uploadingFiles = files.filter(file => file.status === 'uploading');
  const isUploading = uploadingFiles.length > 0;

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <div
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
              <svg
                className={cn(
                  'mx-auto transition-colors',
                  size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-16 w-16' : 'h-12 w-12',
                  isDragOver 
                    ? 'text-nocta-600 dark:text-nocta-300' 
                    : 'text-nocta-400 dark:text-nocta-500'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                />
              </svg>
            </div>
            
            <div className="text-sm">
              <p className={cn(
                'font-medium',
                isDragOver 
                  ? 'text-nocta-700 dark:text-nocta-200' 
                  : 'text-nocta-600 dark:text-nocta-300'
              )}>
                {isDragOver ? dragText : uploadText}
              </p>
              {!isDragOver && (
                <div className="mt-1 space-y-1">
                  {accept && (
                    <p className="text-xs text-nocta-500 dark:text-nocta-400">
                      Accepted types: {accept}
                    </p>
                  )}
                  {maxSize && (
                    <p className="text-xs text-nocta-500 dark:text-nocta-400">
                      Max size: {formatFileSize(maxSize)}
                    </p>
                  )}
                  {multiple && maxFiles && (
                    <p className="text-xs text-nocta-500 dark:text-nocta-400">
                      Max files: {maxFiles}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </FileUploadZone>
      </div>

      {hasFiles && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-nocta-900 dark:text-nocta-100">
              Files ({files.length}{maxFiles ? `/${maxFiles}` : ''})
            </h4>
            {(pendingFiles.length > 0 || isUploading) && onUpload && (
              <button
                onClick={handleUpload}
                disabled={disabled || isUploading}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-2',
                  'bg-nocta-900 text-white hover:bg-nocta-800 dark:bg-nocta-100 dark:text-nocta-900 dark:hover:bg-nocta-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isUploading && <Spinner size="sm" variant="secondary" />}
                {isUploading 
                  ? `Uploading ${uploadingFiles.length} file${uploadingFiles.length > 1 ? 's' : ''}...`
                  : `Upload ${pendingFiles.length} file${pendingFiles.length > 1 ? 's' : ''}`
                }
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <FileUploadItem
                key={file.id}
                file={file}
                showPreview={showPreview}
                onRemove={handleRemoveFile}
                size={size || 'md'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 