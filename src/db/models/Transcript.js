import mongoose, { Schema }  from 'mongoose';
import Comment from './Comment';

const TranscriptSchema = new Schema({
	title: { type: String }, 
	attachment: { type: String },	
	date: {
		type: Date,
		required: [true, 'Date is required']
	},
	author: {
		type: String
	},
	body: {
		type: String
	}
});

TranscriptSchema.virtual('commentCount').get(function() {
	
});

TranscriptSchema.pre('save', function() {

});

TranscriptSchema.pre('remove', function(next) {
	
});

TranscriptSchema.post('save', function() {

});

TranscriptSchema.post('remove', function() {

});

export const Transcript = mongoose.model('transcript', TranscriptSchema);