import { useRef, useState } from 'react'

interface FileDropZoneProps {
  onFileContent: (content: string) => void;
}

const FileDropZone = ({onFileContent}: FileDropZoneProps) => {

	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	// Shared file processing logic
	const processFile = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const content = e.target?.result;
			if (typeof content === 'string') {
			onFileContent(content);
			}
		};
		reader.readAsText(file);
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if(!file) return 
		processFile(file);
	};

	// Handle file drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    };

    // Handle drag over (required to allow drop)
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };


	
	return (
		<>
			{/* File Upload Button */}
			<input 
				type="file" 
				accept=".json"
				onChange={handleFileSelect}
				style={{ display: 'none' }}
				ref={fileInputRef}
				/>
			<button
				className="mb-4"
				onClick={() => fileInputRef.current?.click()}>
				Upload Netlist File
			</button>
			
			{/* Drag & Drop Surface */}
			<div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`h-32 w-1/2 border-2 border-dashed rounded-lg 
                    transition-colors duration-200 ease-in-out
                    flex items-center justify-center cursor-pointer
                    ${isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
            >
                <p className="text-gray-500 text-lg">
                    {isDragging ? 'Drop file here' : 'or Drop your netlist file here'}
                </p>
            </div>
		</>
	)

}

export default FileDropZone