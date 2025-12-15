import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import UploadSurface from './components/UploadSurface'
import UserToggle from './components/UserToggle'
import './App.css'

function App() {

	function handleUser(value: string) {
	}

	useEffect(() => {


	},[])

  return (
      <div className="w-full h-full flex flex-col">
		{/* Header */}
		<div className="flex w-full px-6 py-4 border-b border-slate-200 justify-between">
			<h2 className="text-4xl font-light">Netlist <span className="font-medium text-[#42e2b8]">V²</span></h2>
			<UserToggle onUserChange={handleUser}/>
		</div>

		{/* Main Layout */}
		<div className="flex flex-1">
			<Sidebar />
			<UploadSurface/>
		</div>

		


      </div>
  )
}

export default App
