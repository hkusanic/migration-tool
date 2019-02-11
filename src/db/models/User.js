import mongoose, { Schema }  from 'mongoose';

const UserSchema = new Schema({
	name: {
		en: {
			type: String,
			validate: {
				validator: (name) => name.length > 2,
				message: 'Name must be longer than 2 characters'
			},
			required: [true, 'Title is required']
		},
		ru: {
			type: String,
			validate: {
				validator: (name) => name.length > 2,
				message: 'Имя должно быть длиннее 2 символов'
			},
			required: [true, 'Название обязательно']
		}
	},
	active: {
		type: Boolean,
		required: [true, 'Type is required']
	},
	picture: {
		type: String
	},
	permission: {
		type: String
	},
	roles: {
		type: String
	},
	signature: {
		type: String
	},
	createdDate: {
		type: String
	},
	lastAccessDate: {
		type: String
	},
	hhnsDescipe: {
		type: String
	},
	connectedUser: {
		type: String
	}
});

// LectureSchema.virtual('commentCount').get(function() {
// 	return this.comments.length;
// });

UserSchema.pre('save', function() {

});

UserSchema.pre('remove', function(next) {
	//const comment = mongoose.model('comment'); // this is how you load other models to avoid circular reference with import

	// comment.remove({ _id: { $in: this.comments }})
	// 	.then(() => next()); // remove array of commenets
});

UserSchema.post('save', function() {

});

UserSchema.post('remove', function() {

});

export const User = mongoose.model('user', UserSchema);