// Shared TypeScript interfaces for the netlist visualizer

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