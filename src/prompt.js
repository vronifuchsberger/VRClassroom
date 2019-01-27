const prompt = require('electron-prompt');
const Jimp = require('jimp');
const getPanoramaTiles = require('google-panorama-equirectangular/lib/getPanoramaTiles.js');
const path = require('path');

module.exports = (win, assetDir) => {
  prompt(
    {
      title: 'StreetView URL',
      label: 'Streetview URL',
      inputAttrs: {
        type: 'url',
        require: true,
      },
    },
    win,
  )
    .then(async r => {
      if (r === null) {
        console.log('user cancelled');
      } else {
        const match = r.match(/\!1s([A-Z0-9_-]+)/i);
        if (match.length > 1) {
          //TODO download image
          //TODO get Google's pictures too
          let fileName;

          if (match[1].length === 22) {
            fileName = await getGooglePanorama(match[1], assetDir);
          } else {
            fileName = await getUserPanorama(match[1], assetDir);
          }

          win.webContents.send('open', fileName);
        }
      }
    })
    .catch(console.error);
};

async function getGooglePanorama(id, assetDir) {
  const {images, width, height} = getPanoramaTiles(id, {
    zoom: 3,
  });

  const tiles = await Promise.all(
    images.map(tile => Jimp.read('http:' + tile.url)),
  );
  const img = await new Jimp(width, height);

  tiles.forEach((tile, i) => {
    img.composite(tile, images[i].position[0], images[i].position[1]);
  });
  const fileName = `${id}.jpg`;
  const imagepath = path.join(assetDir, fileName);
  await img.quality(60).writeAsync(imagepath);
  return fileName;
}

async function getUserPanorama(id, assetDir) {
  const img = await Jimp.read(
    `https://lh3.googleusercontent.com/p/${id}=w5000`,
  );
  const fileName = `${id}.jpg`;
  await img.quality(60).writeAsync(path.join(assetDir, `${id}.jpg`));
  return fileName;
}
