import { formatDate } from "./utils";
import { NetlistSummary } from '../types';

interface SidebarProps {
	netLists: NetlistSummary[];
	onNetlistSelect: (netlistId: string) => void;
	selectedNetlistId?: string;
}
const Sidebar = ({netLists, onNetlistSelect, selectedNetlistId}: SidebarProps) => {

	return (
		<div className="h-full w-1/4 p-6 bg-gray-50 border-r border-gray-200 shadow-inner">
			<h3 className="text-2xl">Netlists</h3>
			<ul className="m-0 p-0">
			{netLists.length > 0 && netLists.map((list: NetlistSummary) => (
				<li 
					key={list._id}
					className={`list-none my-2 p-2 hover:bg-[#bcffed] transition rounded cursor-pointer ${
						selectedNetlistId === list._id ? 'bg-[#42e2b8] text-white' : ''
					}`}
					onClick={() => onNetlistSelect(list._id)}>
					<div className="font-bold">{list.name}</div>
					<div className="font-light">Created: {formatDate(list.createdAt)}</div>
				</li>	
			))}
			</ul>
		</div>
	)

}

export default Sidebar;