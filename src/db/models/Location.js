import mongoose, { Schema }  from 'mongoose';

const LocationSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
});

export const Location = mongoose.model('location', LocationSchema);
