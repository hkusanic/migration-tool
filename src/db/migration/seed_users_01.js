
import * as _ from 'lodash';
import users from '../json/users.json';
import { User } from '../models/User';

export const SeedUsers = () => {
	users.data.map((user, index) => {

		const newUser = new User({
			name: {
				en: user.Name,
				ru: user.Name
			},
			active: user.Active.toLowerCase() === 'true' ? true : false,
			picture: user.Picture,
		// email: user['E-mail'],
			language: user.Language,
			permission: user.Permission,
			roles:user.Roles,
			signature: user.Signature,
			createdDate: user['Created date'],
			lastAccessDate: user['Last access'],
			hhnsDescipe: user['Are you Niranjana Swami disciple?'],
			connectedUser: user['Rendered User']
		});

		newUser.save()
			.then((result) => console.log(result))
			.catch((err) => console.log(err));
	});
}


