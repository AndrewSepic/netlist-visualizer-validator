// Shared TypeScript interfaces for the netlist visualizer

// Component styling for visualization
export interface ComponentStyle {
  shape: 'circle' | 'rect' | 'ellipse';
  stroke?: string;
  strokeWidth?: number;
  // For circles
  r?: number;
  // For rectangles
  width?: number;
  height?: number;
  // For text
  textColor?: string;
  fontSize?: number;
}

// Pure graph (no layout/positioning)
export interface PureGraphNode {
  id: string;
  component: Component;
  style: ComponentStyle;
}

export interface PureGraphEdge {
  id: string;
  net: Net;
  source: string;
  target: string;
}

export interface PureGraph {
  nodes: PureGraphNode[];
  edges: PureGraphEdge[];
}

// Positioned graph (after layout)
export interface GraphNode extends PureGraphNode {
  position: { x: number, y: number };
}

export interface GraphEdge extends PureGraphEdge {
  path: { x1: number, y1: number, x2: number, y2: number };
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Pin {
	id: string;
	name: string;
}

export interface Component {
	id: string;
	name: string;
	type: string;
	pins: Pin[];
}

export interface Connection {
	componentId: string;
	pinId: string;
}

export interface Net {
	id: string;
	name: string;
	connections: Connection[];
}

export interface ValidationError {
	rule: string;
	message: string;
	severity: 'error' | 'warning';
	componentId?: string;
	netId?: string;
}

export interface ValidationResults {
	isValid: boolean;
	errors: ValidationError[];
}

// Summary netlist (for sidebar)
export interface NetlistSummary {
	_id: string;
	name: string;
	createdAt: string;
	userId: string;
}

// Full netlist (for visualization)
export interface FullNetlist {
	_id: string;
	userId: string;
	name: string;
	components: Component[];
	nets: Net[];
	validationResults?: ValidationResults;
	createdAt: string;
	updatedAt?: string;
}