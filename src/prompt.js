const prompt = require('electron-prompt');

module.exports = win => {
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
    .then(r => {
      if (r === null) {
        console.log('user cancelled');
      } else {
        const match = r.match(/\!1s([A-Z0-9_-]+)/i);
        if (match.length > 1) {
          //TODO download image
          //TODO get Google's pictures too
          win.webContents.send(
            'streetview',
            `https://lh3.googleusercontent.com/p/${match[1]}=w10000`,
          );
        }
      }
    })
    .catch(console.error);
};
