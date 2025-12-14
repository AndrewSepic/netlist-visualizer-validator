import mongoose from "mongoose";

const netlistSchema = new mongoose.Schema({
  // Basic info
  name: { 
    type: String, 
    required: true,
    trim: true  // Removes whitespace
  },
  
  // Components array - each component has pins
  components: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, // "IC", "resistor", etc.
    pins: [{
      id: { type: String, required: true },
      name: { type: String, required: true }
    }]
  }],
  
  // Nets array - electrical connections
  nets: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    connections: [{
      componentId: { type: String, required: true },
      pinId: { type: String, required: true }
    }]
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now }
});

// Create the model
const NetList = mongoose.model('Netlist', netlistSchema);
export default NetList;