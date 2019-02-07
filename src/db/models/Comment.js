import mongoose, { Schema }  from 'mongoose';

const CommentSchema = new Schema({
	date: {
		type: Date,
		required: [true, 'Date is required']
	},
	
});

export const Comment = mongoose.model('comment', CommentSchema);
