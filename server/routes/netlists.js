import express from 'express';
import Netlist from '../models/NetList.js';

const router = express.Router();

// Create a new netlist
router.post("/", async (req, res) => {
  try {
    const netlistData = req.body;
    const netlist = new Netlist(netlistData);
    const savedNetlist = await netlist.save();
    res.status(201).json(savedNetlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;