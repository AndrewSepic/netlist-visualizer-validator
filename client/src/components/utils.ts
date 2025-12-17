
import { FullNetlist, PureGraph, PureGraphNode, PureGraphEdge, Graph, GraphNode, GraphEdge, ComponentStyle, Net } from "../types";

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }); 
};

// Component styling based on type
const getComponentStyle = (type: string): ComponentStyle => {
  switch(type.toLowerCase()) {
    case 'microcontroller':
		return { shape: 'rect', width: 150, height: 90, textColor: 'light-gray' };
    case 'ic':
      return { shape: 'rect', width: 100, height: 60, textColor: 'light-gray' };
    case 'led':
      return { shape: 'circle', r: 40, textColor: 'light-gray' };
    case 'resistor':
      return { shape: 'rect', width: 80, height:40, textColor: 'light-gray' };
    case 'connector':
      return { shape: 'rect', width: 60, height: 60, textColor: 'light-gray' };
    default:
      return { shape: 'circle', r: 35, textColor: 'light-gray' };
  }
};

// Create edges from a net (chained strategy)
const createEdgesFromNet = (net: Net): PureGraphEdge[] => {
  const edges: PureGraphEdge[] = [];
  const connectedComponents = net.connections.map(conn => conn.componentId);
  
  // Chain components together
  for (let i = 0; i < connectedComponents.length - 1; i++) {
    edges.push({
      id: `${net.id}-${i}`,
      net,
      source: connectedComponents[i],
      target: connectedComponents[i + 1]
    });
  }
  
  return edges;
};

// Step 1: Create pure graph (no positioning)
export const createGraph = (netlist: FullNetlist): PureGraph => {
  // Process components into styled nodes (no positions yet)
  const nodes: PureGraphNode[] = netlist.components.map(component => ({
    id: component.id,
    component,
    style: getComponentStyle(component.type)
  }));

  // Process nets into edges between connected components  
  const edges: PureGraphEdge[] = netlist.nets.flatMap(net => 
    createEdgesFromNet(net)
  );

  return { nodes, edges };
};

// Step 2: Layout algorithm - simple grid
export const layoutGraph = (pureGraph: PureGraph, layoutType: 'grid' | 'circle' = 'grid'): Graph => {
  if (layoutType === 'grid') {
    return layoutGridGraph(pureGraph);
  } else {
    return layoutCircleGraph(pureGraph);
  }
};

// Grid layout implementation
const layoutGridGraph = (pureGraph: PureGraph): Graph => {
  const nodeCount = pureGraph.nodes.length;
  const cols = Math.ceil(Math.sqrt(nodeCount));
  
  // Position nodes in grid
  const nodes: GraphNode[] = pureGraph.nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return {
      ...node,
      position: {
        x: 120 + (col * 200),
        y: 120 + (row * 180)
      }
    };
  });

  // Create positioned edges with parallel edge detection
  const edges: GraphEdge[] = pureGraph.edges.map((edge, index, allEdges) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    const x1 = sourceNode?.position.x || 0;
    const y1 = sourceNode?.position.y || 0;
    const x2 = targetNode?.position.x || 0;
    const y2 = targetNode?.position.y || 0;
    
    // Find parallel edges (same source and target)
    const parallelEdges = allEdges.filter(e => 
      (e.source === edge.source && e.target === edge.target) ||
      (e.source === edge.target && e.target === edge.source)
    );
    
    // If there are multiple parallel edges, offset them
    let offsetX = 0;
    let offsetY = 0;
    if (parallelEdges.length > 1) {
      const edgeIndex = parallelEdges.indexOf(edge);
      const offsetAmount = 10; // pixels
      
      // Calculate perpendicular offset
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        // Perpendicular vector
        const perpX = -dy / length;
        const perpY = dx / length;
        
        // Offset each parallel edge differently
        const offset = (edgeIndex - (parallelEdges.length - 1) / 2) * offsetAmount;
        offsetX = perpX * offset;
        offsetY = perpY * offset;
      }
    }
    
    return {
      ...edge,
      path: {
        x1: x1 + offsetX,
        y1: y1 + offsetY,
        x2: x2 + offsetX,
        y2: y2 + offsetY
      }
    };
  });

  return { nodes, edges };
};

// Circle layout implementation
const layoutCircleGraph = (pureGraph: PureGraph): Graph => {
  const nodeCount = pureGraph.nodes.length;
  const radius = Math.max(150, nodeCount * 30);
  const centerX = 400;
  const centerY = 300;
  
  // Position nodes in circle
  const nodes: GraphNode[] = pureGraph.nodes.map((node, index) => {
    const angle = (index * 2 * Math.PI) / nodeCount;
    
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });

  // Create positioned edges with parallel edge detection
  const edges: GraphEdge[] = pureGraph.edges.map((edge, index, allEdges) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    const x1 = sourceNode?.position.x || 0;
    const y1 = sourceNode?.position.y || 0;
    const x2 = targetNode?.position.x || 0;
    const y2 = targetNode?.position.y || 0;
    
    // Find parallel edges (same source and target)
    const parallelEdges = allEdges.filter(e => 
      (e.source === edge.source && e.target === edge.target) ||
      (e.source === edge.target && e.target === edge.source)
    );
    
    // If there are multiple parallel edges, offset them
    let offsetX = 0;
    let offsetY = 0;
    if (parallelEdges.length > 1) {
      const edgeIndex = parallelEdges.indexOf(edge);
      const offsetAmount = 10; // pixels
      
      // Calculate perpendicular offset
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        // Perpendicular vector
        const perpX = -dy / length;
        const perpY = dx / length;
        
        // Offset each parallel edge differently
        const offset = (edgeIndex - (parallelEdges.length - 1) / 2) * offsetAmount;
        offsetX = perpX * offset;
        offsetY = perpY * offset;
      }
    }
    
    return {
      ...edge,
      path: {
        x1: x1 + offsetX,
        y1: y1 + offsetY,
        x2: x2 + offsetX,
        y2: y2 + offsetY
      }
    };
  });

  return { nodes, edges };
};