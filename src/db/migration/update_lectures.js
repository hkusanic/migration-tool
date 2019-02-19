import * as _ from 'lodash';
import audio_lectures_en from '../json/audio_lectures_en.json';
import audio_lectures_ru from '../json/audio_lectures_ru.json';
import transcription_en from '../json/transcriptions_en.json';
import transcription_ru from '../json/transcriptions_ru.json';
// import summaries_ru from '../json/summaries_ru.json';
import lectures from '../json/lectures.json';
import fs from 'fs';

export const UpdateLectures = () => {
	let lectureArray = new Set();
	let promises = [];
	lectures.map((lecture, index) => {
		//console.log(`${index} lecture nid: ${lecture.nid}`);
		console.dir(lecture);
		let fid = null;
		if(lecture.audio !== null){
			fid = lecture.audio.replace('https://www.niranjanaswami.relaxweb.ca/dev/download/', '');
		}

		let nid = lecture.nid;
		console.log('NID', nid);
		let english = audio_lectures_en.data.find((audio_en) => {
			return audio_en.filedetails.fid === fid;
		})

		let russian = audio_lectures_ru.data.find((audio_ru) => {
			return audio_ru.filedetails.fid === fid;
		});

		const promise = new Promise((resolve, reject) => {
			try{
				// let trans_EN = transcription_en.data.find((trans_en) => {
				//  	console.log('NID EN', trans_en.ref.target_id);
				//  	return trans_en.ref.target_id == nid ? trans_en.nid : null;
				//  });
				let trans_EN = null;
				let trans_RU = null;
				
				for (let i = 0; i < transcription_en.data.length; i++){
					// look for the entry with a matching `code` value
					if (transcription_en.data[i].ref.target_id == english.nid){
						 console.log(`item ${transcription_en.data[i].nid} found`);
						 trans_EN = transcription_en.data[i].nid;
						 break;
						// obj[i].name is the matched result
					}
				}

				// let trans_RU = transcription_ru.data.find((trans_ru) => {
				// 	console.log('NID RU', trans_ru.ref.target_id);
				// 	return trans_ru.ref.target_id == nid ? trans_ru.nid : null;
				// });

				for (let i = 0; i < transcription_ru.data.length; i++){
					// look for the entry with a matching `code` value
					if (transcription_ru.data[i].ref.target_id == russian.nid){
						 console.log(`item ${transcription_ru.data[i].nid} found`);
						 trans_RU = transcription_ru.data[i].nid;
						 break;
						// obj[i].name is the matched result
					}
				}

				resolve({
					trans_EN,
					trans_RU
				});
			}
			catch(ex){
				console.log(ex);
				reject(ex);
			}
		});

		promises.push(promise);


		promise.then((res) => {
			let newLecture = {
				'title.en': english !== undefined ? english.title: '',
				'title.ru': russian !== undefined ? russian.title: '',
				youtube: lecture.youtubeLinks.map((element) => { return element.link } ).join(',').split(','),
				topic: lecture.topic,
				date: lecture.date,
				event: lecture.event,
				translation: lecture.translation,
				audio: english !== undefined ? english.playback : null || russian !== undefined ? russian.playback : null,
				duration: lecture.duration,
				downloads: lecture.downloads,
				location: lecture.location,
				transcriptions: []
			};
	
			if(res.trans_EN !== undefined && res.trans_EN !== null){
				console.log('PUSH EN', res.trans_EN);
				newLecture.transcriptions.push(res.trans_EN.nid);
			} 
	
			if(res.trans_RU !== undefined && res.trans_RU !== null){
				console.log('PUSH RU', res.trans_RU);
				newLecture.transcriptions.push(res.trans_RU.nid);
			}
			
			lectureArray.add(newLecture); 
		}).catch((err) => console.log('----------ERROR-----------', err));
		
	});
	//console.dir(lectureArray);
	
	Promise.all(promises).then(function(results) {
		console.log('VALUES', results);
		let serializedData = JSON.stringify(lectureArray);
		fs.writeFileSync('updated-lectures.json', serializedData);
	});
}