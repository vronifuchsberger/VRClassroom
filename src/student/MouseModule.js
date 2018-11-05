import {Module} from 'react-360-web';

import {Math as GLMath} from 'webgl-ui';

const {rotateByQuaternion} = GLMath;

class MouseModule extends Module {
  constructor(ctx) {
    super('MouseModule');
    document.addEventListener('mouseup', this.mouseup);
    this._ctx = ctx;
  }

  mouseup = event => {
    const width = event.target.clientWidth;
    const height = event.target.clientHeight;
    const lastX = (event.offsetX / width) * 2 - 1;
    const lastY = -(event.offsetY / height) * 2 + 1;

    const fov = (60 * Math.PI) / 180;
    const tan = Math.tan(fov / 2);
    const aspect = event.target.clientWidth / event.target.clientHeight;
    const x = aspect * tan * lastX;
    const y = tan * lastY;
    const mag = Math.sqrt(1 + x * x + y * y);
    const direction = [];
    direction[0] = x / mag;
    direction[1] = y / mag;
    direction[2] = -1 / mag;

    rotateByQuaternion(direction, this._instance._cameraQuat);

    this._ctx.callFunction('RCTDeviceEventEmitter', 'emit', [
      'markerAdded',
      direction,
    ]);
  };

  _setInstance(instance: ReactInstance) {
    this._instance = instance;
  }
}

let module;

export default {
  addModule: (ctx: Context) => {
    module = new MouseModule(ctx);
    return module;
  },
  setInstance: (instance: ReactInstance) => {
    module._setInstance(instance);
  },
};
