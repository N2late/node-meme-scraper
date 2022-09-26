import * as fs from 'node:fs';
import fetch from 'node-fetch';

const folderName = './memes';

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

const memeUrl = 'https://memegen-link-examples-upleveled.netlify.app/';

const htmlContent = [];

async function getUrlInformation(url) {
  try {
    await fetch(url)
      .then((result) => result.text())
      .then((content) => {
        htmlContent.push(content);
      });
  } catch (err) {
    console.error(err);
  }
}

await getUrlInformation(memeUrl);
const imagesUrlArr = htmlContent[0]
  .split('\n')
  .map((item) => item.split('="').pop())
  .filter((item) => item.includes('.jpg?width='))
  .map((item) => item.replace('"', ''))
  .map((item) => item.replace(' />', ''))
  .slice(0, 10);

imagesUrlArr.map(async (item, index) => {
  try {
    await fetch(item).then((res) =>
      res.body.pipe(fs.createWriteStream('memes/' + 0 + (index + 1) + '.jpg')),
    );
  } catch (err) {}
});
