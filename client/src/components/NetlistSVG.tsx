import { useMemo, useState } from 'react';
import { FullNetlist, Graph, GraphNode, GraphEdge } from '../types';
import { createGraph, layoutGraph } from './utils';

interface NetlistSVGProps {
	selectedNetlist: FullNetlist;
	onBack: () => void;
}

const NetlistSVG = ({ selectedNetlist, onBack }: NetlistSVGProps) => {
	// Create and layout graph using the new architecture
	const graph: Graph = useMemo(() => {
		const pureGraph = createGraph(selectedNetlist);
		return layoutGraph(pureGraph, 'grid');
	}, [selectedNetlist]);

	// Render a component node based on its style
	const renderNode = (node: GraphNode) => {
		const { id, position, style, component } = node;
	
		if (style.shape === 'rect') {
			return (
				<g key={id}>
					<rect
						x={position.x - style.width! / 2}
						y={position.y - style.height! / 2}
						width={style.width}
						height={style.height}
						fill={'#e0e0e0'}
						stroke="#333"
						rx="4"
					/>
					<foreignObject x={position.x - style.width! / 2} y={position.y - style.height! / 2} width={style.width} height={style.height}>
						<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
							<p style={{fontSize: 10, textAlign: 'center'}}>
								{component.name}
							</p>
						</div>
						
					</foreignObject>
				</g>
			);
		} else {
			return (
				<g key={id}>
					<circle
						cx={position.x}
						cy={position.y}
						r={style.r}
						fill={'#e0e0e0'}
						stroke="#333"
					/>
					<text
						x={position.x}
						y={position.y + 4}
						textAnchor="middle"
						fontSize="10"
						fill={style.textColor}
						fontWeight="500"
					>
						{component.name}
					</text>
				</g>
			);
		}
	};

	// Render an edge connection
	const renderEdge = (edge: GraphEdge) => {
		const isGND = edge.net.id.toUpperCase() === 'GND';
		
		return (
			<line
				key={edge.id}
				x1={edge.path.x1}
				y1={edge.path.y1}
				x2={edge.path.x2}
				y2={edge.path.y2}
				stroke="#666"
				strokeWidth="2"
				strokeDasharray={isGND ? "5,5" : undefined}
			/>
		);
	};

	return (
		<div className="w-3/4 p-6 bg-gray-50 flex flex-col">
			<div className="flex-shrink-0 mb-4 flex justify-between items-center">
				<div>
					<h3 className="text-2xl font-medium">{selectedNetlist.name}</h3>
					<div className="flex items-center gap-6">
						<p className="text-sm text-gray-600">
							{graph.nodes.length} components, {graph.edges.length} connections
						</p>
						<div className="flex items-center gap-4 text-sm text-gray-600">
							<span className="font-medium">Legend:</span>
							<div className="flex items-center gap-2">
								<svg width="40" height="2">
									<line x1="0" y1="1" x2="40" y2="1" stroke="#666" strokeWidth="2" />
								</svg>
								<span>Signal</span>
							</div>
							<div className="flex items-center gap-2">
								<svg width="40" height="2">
									<line x1="0" y1="1" x2="40" y2="1" stroke="#666" strokeWidth="2" strokeDasharray="5,5" />
								</svg>
								<span>GND</span>
							</div>
						</div>
					</div>
				</div>
				<button 
					onClick={onBack}
					className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
				>
					Back to Upload
				</button>
			</div>
			
			{/* SVG Visualization Area */}
			<div className="flex-grow min-h-0 bg-white border border-gray-200 rounded-lg">
				<svg className="w-full h-full" viewBox="0 0 666 500">
					{/* Render edges first (behind nodes) */}
					{graph.edges.map(renderEdge)}

					{/* Render nodes on top */}
					{graph.nodes.map(renderNode)}
				 </svg>
			</div>  
		</div>
	);
};

export default NetlistSVG;