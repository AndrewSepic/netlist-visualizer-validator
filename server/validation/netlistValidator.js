// Validation rules for netlist data

// Component types that require GND connection
const COMPONENTS_REQUIRING_GND = [
  'microcontroller',
  'ic',
  'led',
  'connector'
];

/**
 * Validates a netlist object before saving to database
 * @param {Object} netlistData - The netlist to validate
 * @returns {Object} { isValid: boolean, errors: Array }
 */
export function validateNetlist(netlistData) {
  const errors = [];

  // Rule 1: Basic structure checks
  if (!netlistData.components || netlistData.components.length === 0) {
    errors.push({
      rule: 'required_components',
      message: 'Netlist must contain at least one component'
    });
  }

  if (!netlistData.nets || netlistData.nets.length === 0) {
    errors.push({
      rule: 'required_nets',
      message: 'Netlist must contain at least one net'
    });
  }

  // Early return if basic structure is invalid
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Rule 2: Check for GND net existence
  const gndNet = netlistData.nets.find(net => 
    net.id.toUpperCase() === 'GND'
  );

  if (!gndNet) {
    errors.push({
      rule: 'gnd_required',
      message: 'Netlist must include a GND (ground) net'
    });
    // Can't check GND connectivity without a GND net
    return { isValid: false, errors };
  }

  // Rule 3: Validate referential integrity (nets reference valid components/pins)
  const componentIds = new Set(netlistData.components.map(c => c.id));
  
  netlistData.nets.forEach(net => {
    net.connections.forEach(conn => {
      // Check if component exists
      if (!componentIds.has(conn.componentId)) {
        errors.push({
          rule: 'invalid_component_reference',
          message: `Net '${net.name}' references non-existent component '${conn.componentId}'`,
          netId: net.id,
          componentId: conn.componentId
        });
        return;
      }

      // Check if pin exists on component
      const component = netlistData.components.find(c => c.id === conn.componentId);
      const pinExists = component.pins.some(p => p.id === conn.pinId);
      
      if (!pinExists) {
        errors.push({
          rule: 'invalid_pin_reference',
          message: `Net '${net.name}' references non-existent pin '${conn.pinId}' on component '${component.name}'`,
          netId: net.id,
          componentId: conn.componentId,
          pinId: conn.pinId
        });
      }
    });
  });

  // Rule 4: GND connectivity check
  const gndConnectedComponents = new Set(
    gndNet.connections.map(conn => conn.componentId)
  );

  netlistData.components.forEach(component => {
    const needsGND = COMPONENTS_REQUIRING_GND.includes(
      component.type.toLowerCase()
    );

    if (needsGND && !gndConnectedComponents.has(component.id)) {
      errors.push({
        rule: 'gnd_connectivity',
        message: `Component '${component.name}' (${component.type}) must be connected to GND`,
        componentId: component.id
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}