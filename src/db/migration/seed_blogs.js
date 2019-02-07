
import * as _ from 'lodash';
import blogs from '../json/blogs_ru.json';
import fs from 'fs';

export const SeedBlogs = () => {
	let blogArray = new Set();
	blogs.data.map((blog, index) => {
		
		let newBlog = {
			title: blog.title,
			date: blog.date,
			author: blog.author,
			body: blog.Body_raw.value,
			language: 'ru'
		};

		blogArray.add(newBlog);
	});

	let serializedData = JSON.stringify(blogArray);
	fs.writeFileSync('blogs_ru.json', serializedData);
};




