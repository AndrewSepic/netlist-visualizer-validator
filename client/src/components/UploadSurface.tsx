import { useState, useEffect, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';

interface UploadSurfaceProps {
  userId?: string;
  onNetlistUploaded?: () => void;
}

const UploadSurface = ({userId, onNetlistUploaded}: UploadSurfaceProps) => {

	const [ newFile, setNewFile ] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if(!file) return 

		const reader = new FileReader();
		
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const content = e.target?.result;  
			// Parse & validate here
			if(typeof content === 'string') {
				console.log("new file is: ", content)
				setNewFile(content)
			}
		};
		
		reader.readAsText(file);  // Async file reading
	};

	useEffect(() => {

		async function postNetList() {
			try { 
				if(!newFile || !userId ) return
				const netListData = JSON.parse(newFile)

				const response = await fetch('/api/netlists/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-User-Id': userId
					},
					body: JSON.stringify(netListData)
				})

				if(response.ok) {
					const savedNetList = await response.json()
					console.log("File saved!", savedNetList)
					onNetlistUploaded?.(); // Trigger refresh
				} 
			} catch(err) {
				console.error('Error uploading netlist: ', err)
			}
		}

		postNetList()

	},[newFile])

	return (
		<div className="h-full w-3/4 flex flex-col justify-center items-center">

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

			<div className="h-32 w-1/2 border-2 border-dashed border-gray-300 rounded-lg 
				hover:border-gray-400 hover:bg-gray-50 
				transition-colors duration-200 ease-in-out
				flex items-center justify-center cursor-pointer">
			<DndContext>
				<Droppable>
					
					<p className="text-gray-500 text-lg">or Drop your netlist file here</p>
				</Droppable>
			</DndContext>
			</div>
		</div>
	)

}

export default UploadSurface;