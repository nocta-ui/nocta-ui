'use client';

import React, { useState } from 'react';
import { FileUpload, type FileUploadFile } from './file-upload';

export function FileUploadDemo() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const handleUpload = async (filesToUpload: FileUploadFile[]) => {
    // Simulate upload with progress
    for (const file of filesToUpload) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { ...f, progress, status: progress === 100 ? 'success' : 'uploading' as const }
              : f
          )
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic File Upload</h3>
        <FileUpload
          multiple
          accept="image/*,.pdf,.doc,.docx"
          maxSize={5 * 1024 * 1024} // 5MB
          maxFiles={5}
          files={files}
          onFilesChange={setFiles}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
}

export function FileUploadSizesDemo() {
  const [smFiles, setSmFiles] = useState<FileUploadFile[]>([]);
  const [mdFiles, setMdFiles] = useState<FileUploadFile[]>([]);
  const [lgFiles, setLgFiles] = useState<FileUploadFile[]>([]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Small Size</h3>
        <FileUpload
          size="sm"
          files={smFiles}
          onFilesChange={setSmFiles}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Medium Size (Default)</h3>
        <FileUpload
          size="md"
          files={mdFiles}
          onFilesChange={setMdFiles}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Large Size</h3>
        <FileUpload
          size="lg"
          files={lgFiles}
          onFilesChange={setLgFiles}
        />
      </div>
    </div>
  );
}

export function FileUploadImageOnlyDemo() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const handleUpload = async (filesToUpload: FileUploadFile[]) => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFiles(prevFiles => 
      prevFiles.map(f => 
        filesToUpload.find(upload => upload.id === f.id)
          ? { ...f, status: 'success' as const }
          : f
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Image Upload with Preview</h3>
        <FileUpload
          variant="default"
          multiple
          accept="image/*"
          maxSize={2 * 1024 * 1024} // 2MB
          maxFiles={10}
          files={files}
          onFilesChange={setFiles}
          onUpload={handleUpload}
          showPreview={true}
          uploadText="Click to upload images or drag and drop"
          dragText="Drop your images here"
        />
      </div>
    </div>
  );
}

export function FileUploadSingleFileDemo() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Single File Upload</h3>
        <FileUpload
          variant="default"
          multiple={false}
          accept=".pdf,.doc,.docx"
          maxSize={10 * 1024 * 1024} // 10MB
          files={files}
          onFilesChange={setFiles}
          uploadText="Click to upload a document"
          dragText="Drop document here"
        />
      </div>
    </div>
  );
}

export function FileUploadDisabledDemo() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Disabled State</h3>
        <FileUpload
          disabled
          multiple
          files={files}
          onFilesChange={setFiles}
          uploadText="Upload is disabled"
        />
      </div>
    </div>
  );
}

export function FileUploadCustomizationDemo() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const handleUpload = async (filesToUpload: FileUploadFile[]) => {
    // Simulate realistic upload with progress
    for (const file of filesToUpload) {
      // Update to uploading status
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { ...f, status: 'uploading' as const, progress: 0 }
            : f
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { ...f, progress: Math.min(100, progress) }
              : f
          )
        );
      }

      // Complete upload
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { ...f, status: 'success' as const, progress: 100 }
            : f
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Advanced Upload with Progress</h3>
        <FileUpload
          variant="default"
          size="lg"
          multiple
          accept="*/*"
          maxSize={50 * 1024 * 1024} // 50MB
          maxFiles={20}
          files={files}
          onFilesChange={setFiles}
          onUpload={handleUpload}
          showProgress={true}
          showPreview={true}
          uploadText="📁 Drop your files here or click to browse"
          dragText="🎯 Release to upload your files"
          className="border-2 border-dashed border-blue-300 dark:border-blue-700"
        />
      </div>
    </div>
  );
}

export function FileUploadWithErrorDemo() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const handleUpload = async (filesToUpload: FileUploadFile[]) => {
    for (const file of filesToUpload) {
      // Simulate random success/failure
      const willFail = Math.random() > 0.7;
      
      if (willFail) {
        // Simulate failure
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error' as const, error: 'Network error occurred' }
              : f
          )
        );
      } else {
        // Simulate success with progress
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { ...f, status: 'uploading' as const, progress: 0 }
              : f
          )
        );

        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id 
                ? { ...f, progress, status: progress === 100 ? 'success' : 'uploading' as const }
                : f
            )
          );
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload with Random Errors</h3>
        <p className="text-sm text-nocta-600 dark:text-nocta-400 mb-4">
          This demo simulates random upload failures to show error handling
        </p>
        <FileUpload
          multiple
          files={files}
          onFilesChange={setFiles}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
} 