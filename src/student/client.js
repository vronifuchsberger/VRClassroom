// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {ReactInstance} from 'react-360-web';
import KeyboardModule from 'react-360-keyboard/KeyboardModule';
import HostnameModule from './HostnameModule';
import MouseModule from './MouseModule';
const polyfill = new WebVRPolyfill({BUFFER_SCALE: 1.0});
import {Location, Surface} from 'react-360-web';

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    nativeModules: [
      KeyboardModule.addModule,
      new HostnameModule(),
      MouseModule.addModule,
    ],
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot('CylinderView', {}),
    r360.getDefaultSurface(),
  );
  r360.renderToLocation(
    r360.createRoot('ModelView', {}),
    new Location([0, -70, -150]),
  );
  r360.renderToLocation(
    r360.createRoot('MarkerView', {}),
    new Location([0, 0, 0]),
  );

  KeyboardModule.setInstance(r360);
  MouseModule.setInstance(r360);
}

window.React360 = {init};
