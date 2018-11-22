import {AppRegistry, NativeModules, Environment, asset} from 'react-360';
import CylinderView from './CylinderView';
import ModelView from './ModelView';
import Marker from './Marker';
import {registerKeyboard} from 'react-360-keyboard';
import Connection from './Connection';

AppRegistry.registerComponent('CylinderView', () => CylinderView);
AppRegistry.registerComponent('ModelView', () => ModelView);
AppRegistry.registerComponent('MarkerView', () => Marker);
AppRegistry.registerComponent(...registerKeyboard);

new Connection({hostname: NativeModules.HostnameModule.hostname});
Environment.setBackgroundImage(asset('360_world.jpg'));
