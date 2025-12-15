
import {useState, useEffect } from 'react'

interface User {
	_id: string;
	username: string;
	email: string;
}

interface UserToggleProps {
	onUserChange: (userId: string | undefined) => void;
}

const UserToggle = ({onUserChange}: UserToggleProps) => {

	const [ users, setUsers ] = useState<User[]>([])
	const [selectedUser, setSelectedUser] = useState<User | null>(null)

	useEffect(() => {
		// Load users when app starts
		fetch('/api/users')
			.then(res => res.json())
			.then(setUsers)
			.catch(err => console.log("errors", err))
	}, []);

	const handleUserSelect = (username: string) => {
		console.log("username:", username, "users:", users)
		const user = users.find(u => u.username.toLowerCase() === username.toLocaleLowerCase())
		console.log("user", user)
		setSelectedUser(user || null)

		onUserChange(user?._id)
	}

	return (
		<div className="p-4">
			<span className="text-slate-500 text-sm">Toggle User</span>
			<select 
				value={selectedUser?.username || ""} 
				onChange={(e) => handleUserSelect(e.target.value)}
				className="w-full px-3 py-2 border border-gray-300 rounded-md 
						focus:outline-none focus:ring-2 focus:ring-[#42e2b8] 
						focus:border-transparent bg-white shadow-sm"
			>
				<option value="">Select a user...</option>
				{users.length > 0 && users.map(user => (
						<option 
							key={user._id}
							value={user.username}
							>{user.username}</option>
				))}
				
				
			</select>
		</div>
	)

}

export default UserToggle;