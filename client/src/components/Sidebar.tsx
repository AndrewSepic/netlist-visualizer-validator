
const Sidebar = ({netLists = []}) => {

	return (
		<div className="h-full w-1/4 p-6 bg-gray-50 border-r border-gray-200 shadow-inner">
			<h3 className="text-2xl">Netlists</h3>
			<ul className="m-0 p-0">
			{netLists.length > 0 && netLists.map(list => (
				<li className="list-none">
					<div>{list.name}</div>
					<div>Created: {list.createdAt}</div>
				</li>	
			))}
			</ul>
		</div>
	)

}

export default Sidebar;