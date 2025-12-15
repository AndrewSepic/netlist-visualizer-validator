import express from 'express';
import { NetList } from '../models/NetList.js';

const router = express.Router();

// Middleware to require and extract userId from X-User-Id header
function requireUser(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(400).json({ error: 'X-User-Id header is required' });
  }
  req.userId = userId;  // Make userId available to all routes
  next();
}

// Create a new netlist
router.post("/", requireUser, async (req, res) => {
  try {
    const netlistData = req.body;
    netlistData.userId = req.userId;
    
    const netlist = new NetList(netlistData);
    const savedNetlist = await netlist.save();
    res.status(201).json(savedNetlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all netlists for the current user
router.get("/", requireUser, async(req, res) => {
	try {
        const netlists = await NetList.find({ userId: req.userId }).select('name createdAt userId _id');
        res.json(netlists);
	} catch(err) {
		console.error("Error fetching netlists: ", err)
		res.status(500).json({error: err.message})
	}
})

// Get specific netlist (must belong to current user)
router.get("/:id", requireUser, async(req, res) => {
	try {
        const { id } = req.params;
        
        // Find netlist that matches BOTH id AND userId
        const netlist = await NetList.findOne({ _id: id, userId: req.userId });
        
        if (!netlist) {
            return res.status(404).json({ error: "Netlist not found or access denied" });
        }
        
        res.json(netlist);
	} catch(err) {
		res.status(500).json({error: err.message})
	}
})

export default router;