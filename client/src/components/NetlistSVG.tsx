import { FullNetlist, Component, Net } from '../types';

interface NetlistSVGProps {
	selectedNetlist: FullNetlist;
	onBack: () => void;
}

const NetlistSVG = ({ selectedNetlist, onBack }: NetlistSVGProps) => {

	return (
		<div className="w-3/4 h-full p-6 bg-gray-50">
			<div className="mb-4 flex justify-between items-center">
				<h3 className="text-2xl font-medium">{selectedNetlist.name}</h3>
				<button 
					onClick={onBack}
					className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
				>
					Back to Upload
				</button>
			</div>
			
			{/* SVG Visualization Area */}
			<div className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
				<svg width="100%" height="100%" viewBox="0 0 800 600">
					{/* Components as circles */}
					{selectedNetlist.components?.map((component: Component, index: number) => (
						<g key={component.id}>
							<circle 
								cx={100 + (index * 150)} 
								cy={100} 
								r="30" 
								fill="#42e2b8" 
								stroke="#333" 
								strokeWidth="2"
							/>
							<text 
								x={100 + (index * 150)} 
								y={105} 
								textAnchor="middle" 
								fontSize="12" 
								fill="white"
							>
								{component.name.substring(0, 10)}
							</text>
						</g>
					))}
					
					{/* Simple connections */}
					{selectedNetlist.nets?.map((net: Net, index: number) => (
						<line 
							key={net.id}
							x1="100" 
							y1="130" 
							x2="250" 
							y2="130" 
							stroke="#666" 
							strokeWidth="2"
						/>
					))}
				</svg>
			</div>
		</div>
	)

}

export default NetlistSVG;