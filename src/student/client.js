// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import { ReactInstance } from 'react-360-web';
import KeyboardModule from 'react-360-keyboard/KeyboardModule';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    nativeModules: [KeyboardModule.addModule],
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot('student', {
      /* initial props */
      hostname: window.location.hostname,
    }),
    r360.getDefaultSurface(),
  );
  KeyboardModule.setInstance(r360);
}

window.React360 = { init };
