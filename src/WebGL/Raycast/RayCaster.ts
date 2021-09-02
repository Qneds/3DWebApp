import {mat4, vec2, vec3, vec4} from 'gl-matrix';
import Object3D, {ObjectRaycastHit} from 'WebGL/Objects/Object3D';
import Camera from '../Camera/Camera';

export interface RayCastable {
  raycast(raycaster: RayCaster): void;
}

export enum RayCasterMode {
  hitbox = 'hitbox',
  face = 'face',
  edge = 'edge',
  point = 'point',
}

/**
 * RayCaster class
 */
export default class RayCaster {
  private ray: Ray;
  private obj: Object3D | RayCastable;
  private mode: RayCasterMode;
  private recursion: boolean;

  /**
   * Creates new RayCaster
   * @param {Ray} ray
   * @param {Object3D | RayCastable} obj
   * @param {RayCasterMode} mode
   * @param {boolean} recursion
   */
  constructor(ray: Ray, obj: Object3D | RayCastable,
      mode: RayCasterMode = RayCasterMode.hitbox, recursion = true) {
    this.ray = ray;
    this.obj = obj;
    this.mode = mode;
    this.recursion = recursion;
  }


  /**
   * Cast set ray
   * @return {ObjectRaycastHit[] | null}
   */
  public cast(): ObjectRaycastHit[] | null {
    if (this.obj instanceof Object3D) {
      const hits = this.castObject3D(this.obj);
      return hits.filter((h): h is ObjectRaycastHit => h !== null);
    } else {
      console.log('not');
      return null;
    }
  }

  /**
   * Cast in case of Object3D
   * @param {Object3D} o
   * @return {(ObjectRaycastHit | null)[]}
   */
  private castObject3D(o: Object3D): (ObjectRaycastHit | null)[] {
    let outArray: (ObjectRaycastHit | null)[] = [];
    outArray.push(o.raycast(this));

    if (this.recursion) {
      o.getChildrenList().forEach((child) => {
        outArray = outArray.concat(this.castObject3D(child));
      });
    }
    return outArray;
  }

  /**
   * Get mode of raycaster
   * @return {RayCasterMode}
   */
  public getMode(): RayCasterMode {
    return this.mode;
  }

  /**
   * Set mode of raycaster
   * @param {RayCasterMode} mode
   */
  public setMode(mode: RayCasterMode): void {
    this.mode= mode;
  }

  /**
   * Get ray
   * @return {Ray}
   */
  public getRay(): Ray {
    return this.ray;
  }

  /**
   * Set ray
   * @param {Ray} ray
   */
  public setRay(ray: Ray): void {
    this.ray = ray;
  }
}

/**
 * Ray class
 */
export class Ray {
  private origin: vec3;
  private direction: vec3;

  /**
   * Creates Ray
   * @param {vec3} origin
   * @param {vec3} direction
   */
  constructor(origin: vec3 = [0, 0, 0], direction: vec3 = [1, 1, 1]) {
    this.origin = origin;
    this.direction = direction;
  }

  /**
   * Return origin of ray
   * @return {vec3}
   */
  public getOrigin(): vec3 {
    return this.origin;
  }

  /**
   * Return direction of ray
   * @return {vec3}
   */
  public getDirection(): vec3 {
    return this.direction;
  }
}

/**
 * Creates ray from camera perspective
 * @param {vec2} screenCords
 * @param {Camera} camera
 * @return {Ray}
 */
export function createRayFromCamera(screenCords: vec2, camera: Camera): Ray {
  const origin = camera.getPosition();

  // const direction = vec3.fromValues(screenCords[0], screenCords[1], 0.5);
  const direction4 = vec4.fromValues(screenCords[0], screenCords[1], 1, 1);
  const tmpMat = mat4.create();
  mat4.multiply(tmpMat, camera.getUnProjectMatrix(), tmpMat);
  vec4.transformMat4(direction4, direction4, camera.getUnProjectMatrix());
  const direction = vec3.fromValues(
      direction4[0]/direction4[3],
      direction4[1]/direction4[3],
      direction4[2]/direction4[3]);

  vec3.sub(direction, direction, origin);
  vec3.normalize(direction, direction);
  return new Ray(origin, direction);
}
