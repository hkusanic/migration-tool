import mongoose, { Schema }  from 'mongoose';
import Comment from './Comment';


const LectureSchema = new Schema({
	title: {
		en: {
			type: String,
			validate: {
				validator: (title) => title.length > 2,
				message: 'Title must be longer than 2 characters'
			},
			required: [true, 'Title is required']
		},
		ru: {
			type: String,
			validate: {
				validator: (title) => title.length > 2,
				message: 'Название должно быть длиннее 2 символов'
			},
			required: [true, 'Название обязательно']
		}
	},
	type: {
		type: String,
		required: [true, 'Type is required']
	},
	date: {
		type: Date,
		required: [true, 'Date is required']
	},
	event: {
		type: String,	
		required: [true, 'Event is required']
	},
	location: {
		type: Schema.Types.ObjectId,
		ref: 'location'
	},
	// location: {
	// 	type: String,	
	// 	required: [true, 'Location is required']
	// },
	youtube: {
		type: String
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'comment'
	}],
	tags: [],
	nid: {
		type: String
	}
});

LectureSchema.virtual('commentCount').get(function() {
	return this.comments.length;
});

LectureSchema.pre('save', function() {

});

LectureSchema.pre('remove', function(next) {
	const comment = mongoose.model('comment'); // this is how you load other models to avoid circular reference with import

	comment.remove({ _id: { $in: this.comments }})
		.then(() => next()); // remove array of commenets
});

LectureSchema.post('save', function() {

});

LectureSchema.post('remove', function() {

});

export const Lecture = mongoose.model('lecture', LectureSchema);