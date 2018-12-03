import {Module} from 'react-360-web';

export default class HostnameModule extends Module {
  constructor(ctx) {
    super('HostnameModule'); // Makes this module available at NativeModules.HostnameModule
    this.hostname = window.location.hostname;
    this.isTeacher = window.location.search === '?teacher';

    this._ctx = ctx;
  }

  $userHasUnmutedVideo(resolveId, rejectId) {
    this._ctx.invokeCallback(
      window.userUnmutedVideo ? resolveId : rejectId, // callback id, passed to the method
      [], // array of arguments passed to callback
    );
  }
}
