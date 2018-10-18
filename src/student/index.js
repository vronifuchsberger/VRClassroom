import {AppRegistry, NativeModules} from 'react-360';
import CylinderView from './CylinderView';
import ModelView from './ModelView';
import {registerKeyboard} from 'react-360-keyboard';
import Connection from './Connection';

AppRegistry.registerComponent('CylinderView', () => CylinderView);
AppRegistry.registerComponent('ModelView', () => ModelView);
AppRegistry.registerComponent(...registerKeyboard);

new Connection({hostname: NativeModules.HostnameModule.hostname});
