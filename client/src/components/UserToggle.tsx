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
			.catch(err => console.error("errors", err))
	}, []);

	const handleUserSelect = (username: string) => {
		const user = users.find(u => u.username.toLowerCase() === username.toLocaleLowerCase())
		setSelectedUser(user || null)
		onUserChange(user?._id)
	}

	useEffect(() => {
		// Auto-select Andrew when users are loaded
		// Helper function to get a user selected for use of the app
		if (users.length > 0 && !selectedUser) {
			const andrew = users.find(u => u.username.toLowerCase() === 'andrew');
			if (andrew) {
				setSelectedUser(andrew);
				onUserChange(andrew._id); 
			}
		}
	}, [users, selectedUser]); 

	return (
		<div>
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
						>{user.username}
					</option>
				))}
				
			</select>
		</div>
	)

}

export default UserToggle;