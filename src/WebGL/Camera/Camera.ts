import {vec3, mat4} from 'gl-matrix';
import {CanvasEvent, CanvasListener} from 'WebGL/Listeners/CanvasEvent';
import {toRadians} from 'WebGL/utils.ts/Math';
import WebGLU from 'WebGL/WebGlUtils';
/**
 * Standard camera class
 */
export default class Camera implements CanvasListener {
  private azAngle: number;
  private elAngle: number;
  private distanceToLookingPoint: number;
  private position: vec3;
  private pointToLook: vec3;
  private lookAtMatrix: mat4;
  private projectionMatrix: mat4;
  private fov: number;

  private screenWidth = 0;
  private screenHeight = 0;

  private canvasEvent: CanvasEvent | null = null;

  /**
   * create camera with lookAtMatrix
   * @param {number} azAngle in radians
   * @param {number} elAngle in radians
   * @param {number} distanceToLookingPoint
   *  distance between position and lookAtpoint
   * @param {vec3} pointToLook point to look at
   * @param {number} fov field of view
   */
  public constructor(azAngle = 0, elAngle = 0,
      distanceToLookingPoint = 5, pointToLook: vec3 = [0, 0, 0], fov = 60) {
    this.azAngle = azAngle;
    this.elAngle = elAngle;
    this.distanceToLookingPoint = distanceToLookingPoint;
    this.pointToLook = pointToLook;
    this.position = this.updatePosition();
    this.lookAtMatrix = this.calcLookAt();
    this.fov = fov;
    this.projectionMatrix = mat4.create();
    const c = WebGLU.returnCanvas();
    if (c) {
      this.screenHeight = c.height;
      this.screenWidth = c.width;

      const ratio = c.width / c.height;
      if (!this.projectionMatrix) {
        this.projectionMatrix = mat4.create();
      }
      mat4.perspective(this.projectionMatrix,
          toRadians(this.fov/ratio), ratio, 0.1, 100);
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} id
   */
  onResize(x: number, y: number,
      width: number, height: number): void {
    this.screenHeight = height;
    this.screenWidth = width;

    const ratio = width / height;
    if (!this.projectionMatrix) {
      this.projectionMatrix = mat4.create();
    }
    mat4.perspective(this.projectionMatrix,
        toRadians(this.fov/ratio), ratio, 0.1, 100000);
  }

  /**
   * Recalculates position of camera based on distance and angles
   * @return {vec3}
   */
  private updatePosition(): vec3 {
    this.position = [
      this.distanceToLookingPoint *
        Math.cos(this.azAngle) * Math.cos(this.elAngle),
      this.distanceToLookingPoint * Math.sin(this.elAngle),
      this.distanceToLookingPoint *
        Math.sin(this.azAngle) * Math.cos(this.elAngle),
    ];
    return this.position;
  }

  /**
   * Returns viewport dimensions
   * @return {[number, number]}
   */
  public getScreenDimensions(): [number, number] {
    return [this.screenWidth, this.screenHeight];
  }

  /**
   * @return {mat4}
   */
  private calcLookAt(): mat4 {
    const vecUp: vec3 = [0, 1, 0];
    if ((this.elAngle > Math.PI/2) || (this.elAngle <= -(Math.PI/2))) {
      vecUp[1] = -1;
    }
    this.lookAtMatrix = mat4.create();
    return this.lookAtMatrix = mat4.lookAt(this.lookAtMatrix,
        this.position, this.pointToLook, vecUp);
  }
  /**
   * @return {mat4}
   */
  public getLookAtMatrix(): mat4 {
    const out = mat4.create();
    mat4.copy(out, this.lookAtMatrix);
    return out;
  }

  /**
   * Returns projection matrix
   * @return {mat4}
   */
  public getProjectionMatrix(): mat4 {
    const out = mat4.create();
    mat4.copy(out, this.projectionMatrix);
    return out;
  }

  /**
   * Return distance beetween camera and point to look at.
   * @return {number}
   */
  public getRadius(): number {
    return this.distanceToLookingPoint;
  }

  /**
   * Set istance beetween camera and point to look at.
   * @param {number} radius
   */
  public setRadius(radius: number): void {
    this.distanceToLookingPoint = radius;
    this.updatePosition();
    this.calcLookAt();
  }

  /**
   * Return azimut angle.
   * @return {number}
   */
  public getAzimutAngle(): number {
    return this.azAngle;
  }

  /**
   * Set azimut angle.
   * @param {number} angle
   */
  public setAzimutAngle(angle: number): void {
    this.azAngle = angle;
    this.updatePosition();
    this.calcLookAt();
  }

  /**
   * Return elevation angle.
   * @return {number}
   */
  public getElevationAngle(): number {
    return this.elAngle;
  }

  /**
   * Set elevation angle.
   * @param {number} angle
   */
  public setElevationAngle(angle: number): void {
    this.elAngle = angle;
    this.updatePosition();
    this.calcLookAt();
  }

  /**
   * Return current position.
   * @return {vec3}
   */
  public getPosition(): vec3 {
    const out = vec3.create();
    vec3.copy(out, this.position);
    return out;
  }

  /**
   * Sets canvas event, subscirbes to it and usubscribes from old one
   * @param {CanvasEvent | null} canvasEvent
   */
  public setCanvasEvent(canvasEvent: CanvasEvent | null): void {
    if (this.canvasEvent) {
      this.canvasEvent.unsubscribe(this);
    }
    this.canvasEvent = canvasEvent;
    if (this.canvasEvent) {
      this.canvasEvent.subscribe(this);
    }
  }

  /**
   * Returns matrix used to calculate points from screen cords to world cords.
   * @return {mat4}
   */
  public getUnProjectMatrix(): mat4 {
    const out = mat4.create();
    const camModMat = mat4.create();
    mat4.copy(out, mat4.invert(out, this.getProjectionMatrix()));
    mat4.multiply(out, mat4.invert(camModMat, this.getLookAtMatrix()), out);
    return out;
  }
}
