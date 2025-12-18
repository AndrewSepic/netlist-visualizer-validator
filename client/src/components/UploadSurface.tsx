import { useState, useEffect } from 'react';
import FileDropZone from './FileDropZone';

interface UploadSurfaceProps {
  	userId?: string;
  	onNetlistUploaded?: () => void;
}

interface ValidationError {
	rule: string;
	message: string;
}

const UploadSurface = ({userId, onNetlistUploaded}: UploadSurfaceProps) => {

	const [ newFile, setNewFile ] = useState<string | null>(null)
	const [ validationErrors, setValidationErrors ] = useState<ValidationError[] | []>([])
	const [ successMessage, setSuccessMessage ] = useState<boolean>(false)

	// Just receives the file content, doesn't care how it was obtained
	const handleFileContent = (content: string) => {
		setNewFile(content);
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
					setSuccessMessage(true)
					onNetlistUploaded?.(); // Trigger refresh
				} 

				if (!response.ok) {
					const errorData = await response.json();
					if (errorData.errors) {
						setSuccessMessage(false)
						setValidationErrors(errorData.errors);
					}
					return;
				}
				setValidationErrors([]);

			} catch(err) {
				console.error('Error uploading netlist: ', err)
			}
		}

		postNetList()

	},[newFile])

	return (
		<div className="h-full w-3/4 flex flex-col justify-center items-center">

			<FileDropZone onFileContent={handleFileContent}/>

			{successMessage && (
				<div className="mt-6 w-1/2 p-4 bg-green-50 border-2 border-green-300 rounded-lg
								animate-slideUpFadeIn">
					<h4 className="text-green-800 font-semibold text-lg flex items-center gap-2">
						<span>✅</span>
						Upload Successful
					</h4>
					<p className="text-sm text-green-700">{successMessage}</p>
				</div>
			)}
			
			{validationErrors.length > 0 && 
				<div className="mt-6 w-1/2 p-4 bg-red-50 border-2 border-red-300 rounded-lg animate-slideUpFadeIn">
					<h4 className="text-red-800 font-semibold text-lg mb-3 flex items-center gap-2">
						<span>❌</span>
						Validation Failed
					</h4>
					<ul className="space-y-2">
						{validationErrors.map((err, index) => (
							<li key={index} className="text-sm text-red-700 flex gap-2">
								<span className="shrink-0">•</span>
								<span>{err.message}</span>
							</li>
						))}
					</ul>
				</div>
			}
		</div>
	)

}

export default UploadSurface;