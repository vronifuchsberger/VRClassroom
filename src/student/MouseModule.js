import {Module} from 'react-360-web';

class MouseModule extends Module {
  constructor(ctx) {
    super('MouseModule');
    if (location.search === '?teacher') {
      document.addEventListener('mouseup', this.mouseup);
    }

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

    this.rotateByQuaternion(direction, this._instance._cameraQuat);

    this._ctx.callFunction('RCTDeviceEventEmitter', 'emit', [
      'markerAdded',
      direction,
    ]);
  };

  _setInstance(instance: ReactInstance) {
    this._instance = instance;
  }

  rotateByQuaternion(v: Vec3, q: Quaternion) {
    // Optimized implementation of Hamiltonian product, similar to Unity's
    // internal implementation
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const vx = v[0];
    const vy = v[1];
    const vz = v[2];
    const qx2 = qx + qx;
    const qy2 = qy + qy;
    const qz2 = qz + qz;

    const xx2 = qx * qx2;
    const yy2 = qy * qy2;
    const zz2 = qz * qz2;
    const xy2 = qx * qy2;
    const xz2 = qx * qz2;
    const yz2 = qy * qz2;
    const wx2 = qw * qx2;
    const wy2 = qw * qy2;
    const wz2 = qw * qz2;

    v[0] = (1 - yy2 - zz2) * vx + (xy2 - wz2) * vy + (xz2 + wy2) * vz;
    v[1] = (xy2 + wz2) * vx + (1 - xx2 - zz2) * vy + (yz2 - wx2) * vz;
    v[2] = (xz2 - wy2) * vx + (yz2 + wx2) * vy + (1 - xx2 - yy2) * vz;
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
