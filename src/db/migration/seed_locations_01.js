
import video_lectures_en from '../json/video_lectures_en.json';

export const SeedLocations = () => {

	let promise = new Promise((resolve, reject) => { 
		let locationPromisses = [];

		let locationSet = new Set();

		video_lectures_en.data.map((lecture, index) => {
			locationSet.add(lecture.location);
		});


		locationSet.forEach((location, key) => {
			locationPromisses.push(findLocation(location)
				.then((res) => {
					if (res.length === 0){
						createLocation(location)
							.then((result) => {
								console.log(`${result} is created`);
							})
							.catch((err) => console.log(err));
					}
					else{
						console.log('LOCATION NOT UNDEFINED, ALREADY EXISTS');
					}
				})
				.catch((err) => {
					console.error(err);
				}));
		});

		Promise.all(locationPromisses)
			.then((res) => {
				console.log('RESOLVED ALL');
				resolve(res);
			})
			.catch((err) => {
				console.log('RESOLVED ALL FAILED');
				reject(err);
			});

	});

	return promise;

	
}

const createLocation = (location) => {
	const newLocation = new Location({
		name: location
	});

	return newLocation.save();
};

const findLocation = (location) => {
	return Location.find({ name: location });
}