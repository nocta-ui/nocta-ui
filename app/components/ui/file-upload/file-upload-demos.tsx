'use client';

import { useState } from 'react';
import { FileUpload, type FileUploadFile } from './file-upload';

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
				<h3 className="mb-2 text-lg font-semibold">Basic File Upload</h3>
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
				<h3 className="mb-2 text-lg font-semibold">Small Size</h3>
				<FileUpload size="sm" files={smFiles} onFilesChange={setSmFiles} />
			</div>

			<div>
				<h3 className="mb-2 text-lg font-semibold">Medium Size (Default)</h3>
				<FileUpload size="md" files={mdFiles} onFilesChange={setMdFiles} />
			</div>

			<div>
				<h3 className="mb-2 text-lg font-semibold">Large Size</h3>
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
				<h3 className="mb-2 text-lg font-semibold">
					Image Upload with Preview
				</h3>
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
				<h3 className="mb-2 text-lg font-semibold">Single File Upload</h3>
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
				<h3 className="mb-2 text-lg font-semibold">Disabled State</h3>
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
		for (const file of filesToUpload) {
			setFiles((prevFiles) =>
				prevFiles.map((f) =>
					f.id === file.id
						? { ...f, status: 'uploading' as const, progress: 0 }
						: f,
				),
			);

			for (let progress = 0; progress <= 100; progress += Math.random() * 15) {
				await new Promise((resolve) =>
					setTimeout(resolve, 50 + Math.random() * 100),
				);
				setFiles((prevFiles) =>
					prevFiles.map((f) =>
						f.id === file.id ? { ...f, progress: Math.min(100, progress) } : f,
					),
				);
			}

			setFiles((prevFiles) =>
				prevFiles.map((f) =>
					f.id === file.id
						? { ...f, status: 'success' as const, progress: 100 }
						: f,
				),
			);
		}
	};

	return (
		<div className="my-6">
			<div>
				<h3 className="mb-2 text-lg font-semibold">
					Advanced Upload with Progress
				</h3>
				<FileUpload
					variant="default"
					size="lg"
					multiple
					accept="*/*"
					maxSize={50 * 1024 * 1024}
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
			const willFail = Math.random() > 0.7;

			if (willFail) {
				setFiles((prevFiles) =>
					prevFiles.map((f) =>
						f.id === file.id
							? {
									...f,
									status: 'error' as const,
									error: 'Network error occurred',
								}
							: f,
					),
				);
			} else {
				setFiles((prevFiles) =>
					prevFiles.map((f) =>
						f.id === file.id
							? { ...f, status: 'uploading' as const, progress: 0 }
							: f,
					),
				);

				for (let progress = 0; progress <= 100; progress += 20) {
					await new Promise((resolve) => setTimeout(resolve, 200));
					setFiles((prevFiles) =>
						prevFiles.map((f) =>
							f.id === file.id
								? {
										...f,
										progress,
										status:
											progress === 100 ? 'success' : ('uploading' as const),
									}
								: f,
						),
					);
				}
			}
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="mb-2 text-lg font-semibold">
					Upload with Random Errors
				</h3>
				<p className="mb-4 text-sm text-foreground-muted">
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
