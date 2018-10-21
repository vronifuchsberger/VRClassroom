type Raycaster = any;
type Vec3 = any;

const TYPE = 'mouse';

export default class SimpleRaycaster implements Raycaster {
  _enabled: boolean;
  _fov: number;
  _frame: HTMLElement;
  _lastX: number | null;
  _lastY: number | null;

  constructor(frame: HTMLElement, fov: number = 60) {
    this._enabled = true;
    this._fov = fov;
    this._frame = frame;
    this._lastX = null;
    this._lastY = null;

    (this: any)._onMouseMove = this._onMouseMove.bind(this);
    frame.addEventListener('mousemove', this._onMouseMove);
  }

  _onMouseMove(e: MouseEvent) {
    if (!this._enabled) {
      return;
    }
    const width = this._frame.clientWidth;
    const height = this._frame.clientHeight;
    const x = e.offsetX / width * 2 - 1;
    const y = -(e.offsetY / height) * 2 + 1;
    this._lastX = x;
    this._lastY = y;
  }

  enable() {
    this._enabled = true;
  }

  disable() {
    //this._enabled = false;
  }

  getType(): string {
    return TYPE;
  }

  getMaxLength(): number {
    return Infinity;
  }

  fillDirection(direction: Vec3): boolean {
    if (!this._enabled) {
      return false;
    }
    const lastX = this._lastX;
    const lastY = this._lastY;
    if (lastX === null || lastY === null) {
      return false;
    }

    const fov = this._fov * Math.PI / 180;
    const tan = Math.tan(fov / 2);
    const aspect = this._frame.clientWidth / this._frame.clientHeight;
    const x = aspect * tan * lastX;
    const y = tan * lastY;
    const mag = Math.sqrt(1 + x * x + y * y);
    direction[0] = x / mag;
    direction[1] = y / mag;
    direction[2] = -1 / mag;
    return true;
  }

  fillOrigin(origin: Vec3): boolean {
    if (!this._enabled) {
      return false;
    }
    console.log(origin);
    origin[0] = 0;
    origin[1] = 0;
    origin[2] = 0;

    return true;
  }

  drawsCursor() {
    return true;
  }

  hasAbsoluteCoordinates() {
    return false;
  }
}
