import {vec2, vec3, vec4} from 'gl-matrix';
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
  private isInFlyingMode = false;
  private isInOrbitMode = false;

  private zoomScale = 0.01;
  private pix2angle = 0.2;
  private angleSpeed = 0.02;
  private cameraMotionSpeed = 0.1;

  private isLeftActive = false;
  private isRightActive = false;
  private isMiddleActive = false;
  private cameraCanvasWidth: number;
  private keysPressed = {};

  private signAzimut = -1;
  private signElevation = -1;

  /**
   * @param {Camera} camera camera to controll
   * @param {RayCaster} raycaster
   */
  constructor(camera: Camera, raycaster: RayCaster) {
    this.camera = camera;
    this.raycaster = raycaster;
    WebGLKeyboardEvent.subscribe(this);
    WebGLMouseEvent.subscribe(this);
    this.cameraCanvasWidth = this.camera.getScreenDimensions()[0];
    this.pix2angle = 180 / this.cameraCanvasWidth;
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
    if (event.key === 'c' || event.key === 'C') {
      this.isActive = true;
      this.isInOrbitMode = true;
      this.keysPressed['c'] = true;
    }
    if (event.shiftKey) {
      this.isInFlyingMode = true;
      this.isActive = true;
      this.keysPressed['shift'] = true;
    }

    if (event.key === 'a' || event.key === 'A') {
      this.keysPressed['a'] = true;
    }
    if (event.key === 's' || event.key === 'S') {
      this.keysPressed['s'] = true;
    }
    if (event.key === 'd' || event.key === 'D') {
      this.keysPressed['d'] = true;
    }
    if (event.key === 'w' || event.key === 'W') {
      this.keysPressed['w'] = true;
    }
    this.updatePosInFlyingMode();
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  onKeyUp(event: KeyboardEvent): void {
    if (this.blockedBy) return;
    if (event.key === 'c' || event.key === 'C') {
      this.isInOrbitMode = false;
      this.keysPressed['c'] = false;
    }
    if (!event.shiftKey) {
      this.isInFlyingMode = false;
      this.keysPressed['shift'] = false;
    }
    if (event.key === 'a' || event.key === 'A') {
      this.keysPressed['a'] = false;
    }
    if (event.key === 's' || event.key === 'S') {
      this.keysPressed['s'] = false;
    }
    if (event.key === 'd' || event.key === 'D') {
      this.keysPressed['d'] = false;
    }
    if (event.key === 'w' || event.key === 'W') {
      this.keysPressed['w'] = false;
    }

    if (!(this.keysPressed['c'] || this.keysPressed['shift'])) {
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
    const camW = this.camera.getScreenDimensions()[0];
    if (camW !== this.cameraCanvasWidth) {
      this.pix2angle = 180 / camW;
      this.cameraCanvasWidth = camW;
    }

    if (this.blockedBy) return;
    if (this.isActive) {
      if (this.isInOrbitMode && this.isLeftActive) {
      // const signElevation = -1;
      // const signAzimut = this.camera.checkIfCameraUpSideDown() ? 1 : -1;
      // const signAzimut = -1;
        this.camera.setAzimutAngle(
            this.camera.getAzimutAngle() + this.signAzimut *
          this.pix2angle * this.angleSpeed * -dx);
        this.camera.setElevationAngle(
            this.camera.getElevationAngle() + this.signElevation *
          this.pix2angle * this.angleSpeed * -dy);
      } else if (this.isInFlyingMode && this.isLeftActive) {
        '';
      }
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
    this.signAzimut = this.camera.checkIfCameraUpSideDown() ? 1 : -1;
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

  /**
   */
  private updatePosInFlyingMode(): void {
    if (!this.isActive || !this.isInFlyingMode) return;
    const dirVec = vec3.create();
    vec3.zero(dirVec);
    if (this.keysPressed['d']) {
      vec3.add(dirVec, dirVec, [1, 0, 0]);
    }
    if (this.keysPressed['a']) {
      vec3.add(dirVec, dirVec, [-1, 0, 0]);
    }
    if (this.keysPressed['s']) {
      vec3.add(dirVec, dirVec, [0, 0, 1]);
    }
    if (this.keysPressed['w']) {
      vec3.add(dirVec, dirVec, [0, 0, -1]);
    }

    if (vec3.length(dirVec) <= 0) return;
    vec3.normalize(dirVec, dirVec);
    const dirVec4 = vec4.fromValues(dirVec[0], dirVec[1], dirVec[2], 0);
    const worldDirVec4 = vec4.create();
    vec4.transformMat4(worldDirVec4,
        dirVec4, this.camera.getCameraToWorldMatrix());
    const w = worldDirVec4[3] ? worldDirVec4[3] : 1;
    const worldDirVec = vec3.fromValues(
        worldDirVec4[0]/w, worldDirVec4[1]/w, worldDirVec4[2]/w);

    vec3.normalize(worldDirVec, worldDirVec);
    vec3.scale(worldDirVec, worldDirVec, this.cameraMotionSpeed);
    const newPos = vec3.create();
    vec3.add(newPos, this.camera.getPointToLookAt(), worldDirVec);
    this.camera.setPointToLookAt(newPos);
  }
}
