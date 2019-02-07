
import * as _ from 'lodash';
import video_lectures_en from '../json/video_lectures_en.json';
import video_lectures_ru from '../json/video_lectures_ru.json';
import { Lecture } from '../models/Lecture';
import { Location } from '../models/Location';

export const SeedLectures = () => {
	video_lectures_en.data.map((lecture, index) => {
		const ru_version = _.find(video_lectures_ru.data, (l) => {
			return l.youtube_plain[0] === lecture.youtube_plain[0];
		});

		Location.findOne({ name: lecture.location })
			.then((resLocation) => {
				const newLecture = new Lecture({
					title: {
						en: lecture.title,
						ru: ru_version !== undefined ? ru_version.title : 'russian translation missing'
					},
					type: lecture.type,
					date: lecture.date,
					event: lecture.event,
					youtube: lecture.youtube,
					nid: lecture.nid
				});

				// set relation to the location
				newLecture.location = resLocation._doc;

				newLecture.save()
					.then((result) => {
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => {
				console.log(`ERROR for: ${lecture.location}:`, err);
				console.error(err);
			});
	});

	Lecture.findOne({ "title.en": "August 7 - 11, 2017 - Baltics Summer Festival Videos"})
		.populate('location')
		.then((res) => {
			console.log('LOADED LECTURE FOR TEST - displaying related location');
			console.log(res.location);
		});
};




