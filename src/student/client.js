// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import {ReactInstance} from 'react-360-web';
import KeyboardModule from 'react-360-keyboard/KeyboardModule';
import HostnameModule from './HostnameModule';
import WebVRPolyfill from 'webvr-polyfill';
const polyfill = new WebVRPolyfill({BUFFER_SCALE: 1.0});
import {Location, Surface} from 'react-360-web';

// Create a location two meters in front of the user, and one meter down
const location = new Location([0, -1, -2]);

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    nativeModules: [KeyboardModule.addModule, new HostnameModule()],
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot('CylinderView', {}),
    r360.getDefaultSurface(),
  );
  r360.renderToLocation(r360.createRoot('ModelView', {}), location);

  KeyboardModule.setInstance(r360);
  r360.compositor.setBackground('./static_assets/360_world.jpg');
}

window.React360 = {init};
