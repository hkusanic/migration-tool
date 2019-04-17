import lecture_ids  from './db/json/lecture_ids.json';
import summaries_ids from './db/json/summaries_ids.json';

import axios from 'axios';
import puppeteer from 'puppeteer';
import fs from 'fs';



console.log('STARTED');

//UpdateLectures();
//SeedBlogs();

console.log('ENDED');


//let pages = 164;
let homePage = 'https://www.niranjanaswami.net/en';//'https://www.niranjanaswami.relaxweb.ca/dev/en';
let lecturesUrl = 'https://www.niranjanaswami.net/en/video/lectures';//'https://www.niranjanaswami.relaxweb.ca/dev/en/video/lectures';

function resolve(lecturesData) {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true, devtools: true });
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

			
				let count =0;
				
			
						/*for(let i=0; i< lecture_ids.data.length; i++)
						{
							let page1 = await browser.newPage();

							page1.on('response', response => {
								console.log('---lecture response event---');
								response.json().then((res) => {

									console.log('---response event---', res)
								
								})
								.catch((err) => {
									//console.log('---ERROR---', err);
									// ignore
								});
							})

							await page1.goto(`https://www.niranjanaswami.net/rest/object/${lecture_ids.data[i].id}.json`, { waitUntil: ['networkidle2', 'load', 'domcontentloaded'], timeout: 2000 });
							page1.waitFor(3000).then(() => {
								console.log('continue...');
							});
							
						}*/

						for(let i=0; i< 1; i++) //summaries_ids.data.length
						{
							let resValue = null;
							let page1 = await browser.newPage();
							let page2 = await browser.newPage();
							page2.setRequestInterception(true);

							page1.on('response', response => {
								console.log('---summary response event---');
								response.json().then((res) => {

									console.log('---response event---', res)
									resValue = res;

									
								})
								.catch((err) => {
									//console.log('---ERROR---', err);
									// ignore
								});
							})

							page2.on('request', interceptedRequest => {
								console.log('---request---');
								
								// Here, is where you change the request method and 
								// add your post data
								var data = {
										'method': 'POST',
										'postData': resValue !== undefined ? JSON.stringify(resValue) : ''
								};

								// Request modified... finish sending! 
								interceptedRequest.continue(data);
							});

							await page1.goto(`https://www.niranjanaswami.net/rest/object/${summaries_ids.data[i].id}.json`, { waitUntil: ['networkidle2', 'load', 'domcontentloaded'], timeout: 2000 });
							page1.waitFor(3000).then(() => {
								console.log('continue...');
							});
							
							await page2.goto(`http://localhost:3000/api/lecture/create/`, { waitUntil: ['networkidle2', 'load', 'domcontentloaded'], timeout: 2000 });

							
						}

						// await page1.waitForSelector('body').then((res) => {
						// 	//console.dir(res);
						// 	res.jsonValue().then((jsonResponse) => {
						// 		console.log('json', jsonResponse);
						// 	});
						// });
						// await page1.close();
    				// await browser.close();

						// let content = await page1.content();

						// innerText = await page1.evaluate(() => {
						// 		//return JSON.parse(document.querySelector("body").innerText); 
						// 		return document.querySelector("body").innerText;
						// }); 

						// console.log("innerText now contains the JSON");
						// console.log(innerText);
						
						// promise.then((res) => {
						// 	console.log('---RES---');
						// 	console.dir(res);
						// }).catch((err) => {
						// 	console.error(err);
						// });
					//}
					//await page.waitFor(2*1000);
				//});


				// await page.goto(lecturesUrl);
				// await page.waitFor(2*1000);

				// let resolvedLectures = [];

				// resolvedLectures.push(await page.evaluate(() => {
				// 	let lectures = [];	
				// 	let containers = document.querySelectorAll('td.views-field.views-field-title > a');
				// 	containers.forEach((container) => {
				// 		//let lectureElms = container.querySelectorAll('a');//document.querySelector('a[href*="/dev/en/lecture/"]');
				// 		console.log(container);
				// 		lectures.push({
				// 			name: container.innerHTML,
				// 			link: container.href
				// 		});
				// 	});
					
				// 	return lectures;
					
				// }));

				// for(let i=0; i<pages; i++)
				// {
				// 	console.log(`RESOLVE ${i}`);
				// 	//await page.waitForNavigation({waitUntil: 'load'}).then(() => {console.log(`LOADED ${i}`);});
				// 	await page.goto(`${lecturesUrl}?page=${i}`);
				// 	await page.waitFor(2*1000);
				

				// 	resolvedLectures.push(await page.evaluate(() => {
				// 		let lectures = [];	
				// 		let containers = document.querySelectorAll('td.views-field.views-field-title > a');
				// 		containers.forEach((container) => {
				// 			//let lectureElms = container.querySelectorAll('a');//document.querySelector('a[href*="/dev/en/lecture/"]');
				// 			console.log(container);
				// 			lectures.push({
				// 				name: container.innerHTML,
				// 				link: container.href
				// 			});
				// 		});
						
				// 		return lectures;
				// 	}));
					
				// }

				// resolvedLectures = [].concat(...resolvedLectures); // flatten arrays
				// console.log('RESOLVED LECTURE LINKS');
				// //console.dir(resolvedLectures);
        // const lectureData = audio_lectures_en.data;
				// // LOAD INDIVIDUAL LECTURES
				// let lecturePages = [];

				// for(let i = 0; i < resolvedLectures.length; i++) {
				// 	let newLink = resolvedLectures[i].link;
				// 	console.log('Open lecture', newLink);
				// 	await page.goto(newLink);
				// 	await page.waitFor(2*1000);

          

				// 	lecturePages.push(await page.evaluate((lectureData) => {
				// 		let youtubeLinks = [];	
				// 		let containers = document.querySelectorAll('div.field.field-name-field-youtube.field-type-text.field-label-hidden iframe');
				// 		containers.forEach((container) => {
				// 			youtubeLinks.push({
				// 				link: container.src
				// 			});
				// 		});

				// 		let location = document.querySelector('div.field.field-name-field-location.field-type-taxonomy-term-reference.field-label-inline.clearfix div div a').innerText;
				// 		let event = document.querySelector('div.field.field-name-field-event.field-type-taxonomy-term-reference.field-label-inline.clearfix div div a').innerText;
				// 		let title = document.querySelector('div.field.field-name-field-video-reference.field-type-entityreference.field-label-hidden h2 a').innerText;
				// 		let date = document.querySelector('div.field.field-name-field-video-reference.field-type-entityreference.field-label-hidden span.date-display-single').innerText;
				// 		let translation = document.querySelector('div.field.field-name-field-translation.field-type-taxonomy-term-reference.field-label-inline.clearfix div div').innerText;
				// 		let topic = document.querySelector('div.field.field-name-field-topic.field-type-taxonomy-term-reference.field-label-inline.clearfix div div').innerText;
				// 		let audioContainer = document.querySelector('article.node.node-lecture.node-published.node-not-promoted.node-not-sticky.author-admin.even.clearfix div.audio-download a');
				// 		let audio = audioContainer !== null ? audioContainer.href : null;
				// 		let duration = document.querySelector('div.field.field-name-field-duration.field-type-text.field-label-inline.clearfix div div').innerText;
				// 		let downloads = document.querySelector('div.field.field-name-field-downloads.field-type-number-integer.field-label-inline.clearfix div div').innerText;
				// 		let nid = null;
				// 		let en_lecture = null;

				// 		if(audio !== null){
				// 			fid = audio.replace('https://www.niranjanaswami.relaxweb.ca/dev/download/', '');
        //       console.log('--------FID-------', fid);
              
				// 			en_lecture = lectureData.find((audio_en) => {
				// 				return audio_en.filedetails.fid === fid;
				// 			});

				// 			if(en_lecture !== null && en_lecture !== undefined)
				// 			{
				// 				nid = en_lecture.nid;
				// 				console.log('--------NID-------', nid);
				// 			}
				// 		}
						
				// 		return {
				// 			youtubeLinks,
				// 			location,
				// 			event,
				// 			title,
				// 			date,
				// 			translation,
				// 			topic,
				// 			audio,
				// 			duration,
				// 			downloads,
				// 			nid,
				// 		};
				// 	}, lectureData));

				// };
				
				// console.log('RESOLVED LECTURE PAGES');
				// lecturePages = [].concat(...lecturePages); // flatten arrays
				// //console.dir(lecturePages);
				
				// return resolve({
				// 	resolvedLectures,
				// 	lecturePages
				// });
		}
		catch(e){
			return reject(e);
		}
	});
}

resolve().then((res) => {
	//storeData(res);
	console.log('------------DONE-------------');
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