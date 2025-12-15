import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true},
	email: { type: String, required: true, unique: true},
	createdAt: { type: Date, default: Date.now }
})

const netlistSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	name: { 
		type: String, 
		required: true,
		trim: true  // Removes whitespace
	},

	components: [{
		id: { type: String, required: true },
		name: { type: String, required: true },
		type: { type: String, required: true }, // "IC", "resistor", etc.
		pins: [{
		id: { type: String, required: true },
		name: { type: String, required: true }
		}]
	}],
	
	nets: [{
		id: { type: String, required: true },
		name: { type: String, required: true },
		connections: [{
		componentId: { type: String, required: true },
		pinId: { type: String, required: true }
		}]
	}],
	
	createdAt: { type: Date, default: Date.now }
});

// Create the model
const NetList = mongoose.model('NetList', netlistSchema);
const User = mongoose.model('User', userSchema);
export { NetList, User } ;