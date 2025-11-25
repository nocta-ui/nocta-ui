'use client';

import { useState } from 'react';
import { FileUpload, type FileUploadFile } from '@/registry/ui/file-upload';

export function FileUploadDemo() {
	const [files, setFiles] = useState<FileUploadFile[]>([]);

	const handleUpload = async (filesToUpload: FileUploadFile[]) => {
		for (const file of filesToUpload) {
			for (let progress = 0; progress <= 100; progress += 10) {
				await new Promise((resolve) => setTimeout(resolve, 100));
				setFiles((prevFiles) =>
					prevFiles.map((f) =>
						f.id === file.id
							? {
									...f,
									progress,
									status: progress === 100 ? 'success' : ('uploading' as const),
								}
							: f,
					),
				);
			}
		}
	};

	return (
		<div className="my-6">
			<div>
				<FileUpload
					multiple
					accept="image/*,.pdf,.doc,.docx"
					maxSize={5 * 1024 * 1024}
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
		<div className="my-6 space-y-8">
			<div>
				<h3 className="text-sm font-medium text-foreground/70 mb-2">
					Small Size
				</h3>
				<FileUpload size="sm" files={smFiles} onFilesChange={setSmFiles} />
			</div>

			<div>
				<h3 className="text-sm font-medium text-foreground/70 mb-2">
					Medium Size (Default)
				</h3>
				<FileUpload size="md" files={mdFiles} onFilesChange={setMdFiles} />
			</div>

			<div>
				<h3 className="text-sm font-medium text-foreground/70 mb-2">
					Large Size
				</h3>
				<FileUpload size="lg" files={lgFiles} onFilesChange={setLgFiles} />
			</div>
		</div>
	);
}

export function FileUploadImageOnlyDemo() {
	const [files, setFiles] = useState<FileUploadFile[]>([]);

	const handleUpload = async (filesToUpload: FileUploadFile[]) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setFiles((prevFiles) =>
			prevFiles.map((f) =>
				filesToUpload.find((upload) => upload.id === f.id)
					? { ...f, status: 'success' as const }
					: f,
			),
		);
	};

	return (
		<div className="my-6">
			<div>
				<FileUpload
					variant="default"
					multiple
					accept="image/*"
					maxSize={2 * 1024 * 1024}
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
		<div className="my-6">
			<div>
				<FileUpload
					variant="default"
					multiple={false}
					accept=".pdf,.doc,.docx"
					maxSize={10 * 1024 * 1024}
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
		<div className="my-6">
			<div>
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
