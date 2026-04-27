import https from 'https';
import fs from 'fs';
import path from 'path';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const file = fs.createWriteStream(path.resolve('public', 'model.png'));
https.get('https://storage.googleapis.com/mle-sandbox-files/2026-04-27T03:50:57.199Z-image.png', (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded');
  });
}).on('error', (err) => {
  console.error(err);
});
