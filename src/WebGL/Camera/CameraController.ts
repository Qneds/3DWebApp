import {vec2} from 'gl-matrix';
import WebGLKeyboardEvent, {KeyboardListener}
  from 'WebGL/Listeners/KeyboardEvent';
import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';
import RayCaster, {createRayFromCamera} from 'WebGL/Raycast/RayCaster';
import WebGLU from 'WebGL/WebGlUtils';
import Camera from './Camera';

/**
 * Camera controller
 */
export default class CameraController implements MouseListener,
    KeyboardListener {
  private camera: Camera;
  private raycaster: RayCaster;

  private isActive = false;
  private blockedBy = 0;

  private zoomScale = 0.01;
  private pix2angle = 0.2;
  private angleSpeed = 0.01;

  private isLeftActive = false;
  private isRightActive = false;
  private isMiddleActive = false;

  /**
   * @param {Camera} camera camera to controll
   * @param {RayCaster} raycaster
   */
  constructor(camera: Camera, raycaster: RayCaster) {
    this.camera = camera;
    this.raycaster = raycaster;
    WebGLKeyboardEvent.subscribe(this);
    WebGLMouseEvent.subscribe(this);

    const gl = WebGLU.returnWebGLContext();
    if (gl) {
      this.pix2angle = 180 / gl.canvas.width;
    }
  }

  /**
   * Check if camera is controlled at the moment
   * @return {boolean}
   */
  public isCameraActive(): boolean {
    return this.isActive;
  }

  /**
   * Check by how many objects camera is blocked
   * @return {boolean}
   */
  public isCameraBlocked(): boolean {
    return this.blockedBy !== 0;
  }

  /**
   * Block camera by caller
   */
  public block(): void {
    this.blockedBy++;
  }

  /**
   * Unblock camera by caller
   */
  public unblock(): void {
    if (this.blockedBy > 0) this.blockedBy--;
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.blockedBy) return;
    if (event.key === 'c') {
      this.isActive = true;
    }
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  onKeyUp(event: KeyboardEvent): void {
    if (this.blockedBy) return;
    if (event.key === 'c') {
      this.isActive = false;
    }
  }

  /**
   * @param {WheelEvent} event
   */
  onWheel(event: WheelEvent): void {
    if (this.blockedBy) return;
    if (this.isActive) {
      const newRadius = this.camera.getRadius() + event.deltaY * this.zoomScale;
      if (newRadius > 0.1) {
        this.camera.setRadius(newRadius);
      }
    }
  }

  /**
   * @param {MouseEvent} event
   * @param {number} dx
   * @param {number} dy
   */
  onMouseMove(event: MouseEvent, dx: number, dy: number): void {
    if (this.blockedBy) return;
    if (this.isActive && this.isLeftActive) {
      this.camera.setAzimutAngle(
          this.camera.getAzimutAngle() -
          this.pix2angle * this.angleSpeed * -dx);
      this.camera.setElevationAngle(
          this.camera.getElevationAngle() -
          this.pix2angle * this.angleSpeed * -dy);
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event: MouseEvent): void {
    if (this.blockedBy) return;
    if (event.button === 0) {
      this.isLeftActive = true;
    }
    if (event.button === 1) {
      this.isMiddleActive = true;
    }
    if (event.button === 2) {
      this.isRightActive = true;
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event: MouseEvent): void {
    if (this.blockedBy) return;
    if (event.button === 0) {
      this.isLeftActive = false;
    }
    if (event.button === 1) {
      this.isMiddleActive = false;
    }
    if (event.button === 2) {
      this.isRightActive = false;
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseClick(event: MouseEvent): void {
    return;
  }

  /**
   */
  cleanUp(): void {
    WebGLMouseEvent.unsubscribe(this);
    WebGLKeyboardEvent.unsubscribe(this);
  }
}
