import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import NetList from './models/NetList.js';
import netlistRoutes from './routes/netlists.js';

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/netlists";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use('/api/netlists', netlistRoutes);

app.get("/health", (req, res) => {
  res.json({
	 ok: true,
	 mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
	 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
