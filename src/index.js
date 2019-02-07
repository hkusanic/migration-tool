import { Lecture } from './db/models/Lecture';
import { SeedLectures } from './db/migration/seed_lectures_01';
import { SeedUsers } from './db/migration/seed_users_01';
import { SeedLocations } from './db/migration/seed_locations_01';
import { UpdateLectures } from './db/migration/update_lectures';
import { SeedBlogs } from './db/migration/seed_blogs';

import audio_lectures_en from './audio_lectures_en.json';
import audio_lectures_ru from './db/json/audio_lectures_ru.json';


import puppeteer from 'puppeteer';
import fs from 'fs';



console.log('STARTED');

//UpdateLectures();
//SeedBlogs();

console.log('ENDED');


let pages = 1;//25;
let homePage = 'https://www.niranjanaswami.relaxweb.ca/dev/en';
let lecturesUrl = 'https://www.niranjanaswami.relaxweb.ca/dev/en/video/lectures';

function resolve(lecturesData) {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
			const page = await browser.newPage();
				
				await page.setViewport({ width: 1920, height: 1200 });
				await page.goto(homePage,{
					timeout: 3000000
				});

				await page.evaluate(() => {
					let userNameBox = document.querySelector('#edit-name--2');
					let passwordBox = document.querySelector('#edit-pass--2');
					let submitButton = document.querySelector('#edit-submit--2');
					userNameBox.value = 'hrvoje.kusanic@hotmail.com';
					passwordBox.value = 'HareKrsna01!';
					submitButton.click();
				}).then(() => {
					console.log('AFTER LOGIN');
						
				});

				await page.waitForNavigation({waitUntil: 'load'}).then(() => {console.log('LOADED 1');});
				await page.goto(lecturesUrl);
				await page.waitFor(2*1000);

				let resolvedLectures = [];

				resolvedLectures.push(await page.evaluate(() => {
					let lectures = [];	
					let containers = document.querySelectorAll('td.views-field.views-field-title > a');
					containers.forEach((container) => {
						//let lectureElms = container.querySelectorAll('a');//document.querySelector('a[href*="/dev/en/lecture/"]');
						console.log(container);
						lectures.push({
							name: container.innerHTML,
							link: container.href
						});
					});
					
					return lectures;
					
				}));

				for(let i=0; i<pages; i++)
				{
					console.log(`RESOLVE ${i}`);
					//await page.waitForNavigation({waitUntil: 'load'}).then(() => {console.log(`LOADED ${i}`);});
					await page.goto(`${lecturesUrl}?page=${i}`);
					await page.waitFor(2*1000);
				

					resolvedLectures.push(await page.evaluate(() => {
						let lectures = [];	
						let containers = document.querySelectorAll('td.views-field.views-field-title > a');
						containers.forEach((container) => {
							//let lectureElms = container.querySelectorAll('a');//document.querySelector('a[href*="/dev/en/lecture/"]');
							console.log(container);
							lectures.push({
								name: container.innerHTML,
								link: container.href
							});
						});
						
						return lectures;
					}));
					
				}

				resolvedLectures = [].concat(...resolvedLectures); // flatten arrays
				console.log('RESOLVED LECTURE LINKS');
				//console.dir(resolvedLectures);

				// LOAD INDIVIDUAL LECTURES
				let lecturePages = [];

				for(let i = 0; i < resolvedLectures.length; i++) {
					let newLink = resolvedLectures[i].link;
					console.log('Open lecture', newLink);
					await page.goto(newLink);
					await page.waitFor(2*1000);

					const lectureData = audio_lectures_en.data;

					lecturePages.push(await page.evaluate((lectureData) => {
						let youtubeLinks = [];	
						let containers = document.querySelectorAll('div.field.field-name-field-youtube.field-type-text.field-label-hidden iframe');
						containers.forEach((container) => {
							youtubeLinks.push({
								link: container.src
							});
						});

						let location = document.querySelector('div.field.field-name-field-location.field-type-taxonomy-term-reference.field-label-inline.clearfix div div a').innerText;
						let event = document.querySelector('div.field.field-name-field-event.field-type-taxonomy-term-reference.field-label-inline.clearfix div div a').innerText;
						let title = document.querySelector('div.field.field-name-field-video-reference.field-type-entityreference.field-label-hidden h2 a').innerText;
						let date = document.querySelector('div.field.field-name-field-video-reference.field-type-entityreference.field-label-hidden span.date-display-single').innerText;
						let translation = document.querySelector('div.field.field-name-field-translation.field-type-taxonomy-term-reference.field-label-inline.clearfix div div').innerText;
						let topic = document.querySelector('div.field.field-name-field-topic.field-type-taxonomy-term-reference.field-label-inline.clearfix div div').innerText;
						let audioContainer = document.querySelector('article.node.node-lecture.node-published.node-not-promoted.node-not-sticky.author-admin.even.clearfix div.audio-download a');
						let audio = audioContainer !== null ? audioContainer.href : null;
						let duration = document.querySelector('div.field.field-name-field-duration.field-type-text.field-label-inline.clearfix div div').innerText;
						let downloads = document.querySelector('div.field.field-name-field-downloads.field-type-number-integer.field-label-inline.clearfix div div').innerText;
						let nid = null;
						let en_lecture = null;

						if(audio !== null){
							fid = audio.replace('https://www.niranjanaswami.relaxweb.ca/dev/download/', '');
							console.log('--------FID-------', fid);
							en_lecture = lectureData.find((audio_en) => {
								return audio_en.filedetails.fid === fid;
							});

							if(en_lecture !== null)
							{
								nid = en_lecture.nid;
								console.log('--------NID-------', nid);
							}
						}
						
						return {
							youtubeLinks,
							location,
							event,
							title,
							date,
							translation,
							topic,
							audio,
							duration,
							downloads,
							nid,
						};
					}));

				};
				
				console.log('RESOLVED LECTURE PAGES');
				lecturePages = [].concat(...lecturePages); // flatten arrays
				//console.dir(lecturePages);
				
				return resolve({
					resolvedLectures,
					lecturePages
				});
		}
		catch(e){
			return reject(e);
		}
	});
}

resolve().then((res) => {
	storeData(res);
	console.log('------------DONE-------------');
	//console.dir(res);
}).catch((err) => console.log(err));


const storeData = (data) => {
  try {
		let serializedData = JSON.stringify(data)
    fs.writeFileSync('scraped-data.json', serializedData);
  } catch (err) {
    console.error(err)
  }
}

const loadData = (path) => {
  try {
    return fs.readFileSync(path, 'utf8')
  } catch (err) {
    console.error(err)
    return false
  }
}