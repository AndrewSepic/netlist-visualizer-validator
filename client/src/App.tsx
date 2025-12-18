import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import NetlistSVG from './components/NetlistSVG'
import UploadSurface from './components/UploadSurface'
import UserToggle from './components/UserToggle'
import { NetlistSummary, FullNetlist } from './types'
import './App.css'

function App() {

	const [activeUserId, setActiveUserId ] = useState<string | undefined>(undefined)
	const [netLists, setNetLists] = useState<NetlistSummary[]>([])
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [selectedNetlist, setSelectedNetlist] = useState<FullNetlist | null>(null);

	const triggerNetlistRefresh = () => {
		setRefreshTrigger(prev => prev + 1);
	};

	const handleNetlistSelect = async (netlistId: string) => {
		if (!activeUserId) return;
		try {
			const response = await fetch(`/api/netlists/${netlistId}`, {
				headers: { 'X-User-Id': activeUserId }
			});
			if (response.ok) {
				const netlist = await response.json();
				setSelectedNetlist(netlist);
			}
		} catch (error) {
			console.error('Error fetching netlist:', error);
		}
	};

	function handleUser(userId: string | undefined) {
		setActiveUserId(userId)
	}

	useEffect(() => {
		async function fetchNetLists() {
			try {
				if(!activeUserId) return
				const response = await fetch('api/netlists/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'X-User-Id': activeUserId
					}})
				
				if(response.ok) {
					const fetchedLists = await response.json()
					setNetLists(fetchedLists)
				}
			} catch(err) {
				console.error("Error fetching netlists: ", err)
			}
		}
		setSelectedNetlist(null)
		fetchNetLists()
	},[activeUserId, refreshTrigger])

  	return (
     	 <div className="w-full h-full flex flex-col">
			{/* Header */}
			<div className="flex w-full px-6 py-6 border-b border-slate-200 justify-between items-center">
				<h2 className="text-4xl font-light">Netlist <span className="font-medium text-[#42e2b8]">V²</span></h2>
				<UserToggle onUserChange={handleUser}/>
			</div>

			{/* Main Layout */}
			<div className="flex flex-1 overflow-hidden">
				<Sidebar 
					netLists={netLists} 
					onNetlistSelect={handleNetlistSelect}
					selectedNetlistId={selectedNetlist?._id}
				/>
				
				{/* Show visualization if netlist selected, otherwise show upload */}
				{selectedNetlist ? (
					<NetlistSVG 
						selectedNetlist={selectedNetlist}
						onBack={() => setSelectedNetlist(null)}
					/>
				) : (
					<UploadSurface userId={activeUserId} onNetlistUploaded={triggerNetlistRefresh}/>
				)}
			</div>
		</div>
	)
}

export default App
