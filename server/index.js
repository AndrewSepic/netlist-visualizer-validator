import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { User } from './models/NetList.js';
import netlistRoutes from './routes/netlists.js';

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/netlists";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
	seedUsers();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });


// Seed users for Demo purposes
async function seedUsers() {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      const seedUsers = [
        { username: "Andrew", email: "andrewsepic@gmail.com" },
        { username: "Sergiy", email: "sergiy@quilter-test.ai" },
        { username: "Matthew", email: "matthew@quilter-test.ai" }
      ];
      
      await User.insertMany(seedUsers);
      console.log('✅ Seed users created:', seedUsers.map(u => u.username).join(', '));
    } else {
      console.log(`👥 ${userCount} users already exist`);
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
}

app.use('/api/netlists', netlistRoutes);

app.get("/health", (req, res) => {
  res.json({
	 ok: true,
	 mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
	 });
});

// Get all users (for frontend user selection)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select('_id username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
