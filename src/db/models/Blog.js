import mongoose, { Schema }  from 'mongoose';
import Comment from './Comment';

const BlogSchema = new Schema({
	title: { type: String }, 
	date: {
		type: Date
	},
	tags: [
		{ type: String},
	],
	author: {
		type: String
	},
	body: {
		type: String
	},
	language: {
		type: String
	}
});


BlogSchema.pre('save', function() {

});

BlogSchema.pre('remove', function(next) {
	
});

BlogSchema.post('save', function() {

});

BlogSchema.post('remove', function() {

});

export const Blog = mongoose.model('blog', BlogSchema);