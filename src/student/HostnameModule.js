import {Module} from 'react-360-web';

export default class HostnameModule extends Module {
  constructor() {
    super('HostnameModule'); // Makes this module available at NativeModules.HostnameModule
    this.hostname = window.location.hostname;
  }
}
