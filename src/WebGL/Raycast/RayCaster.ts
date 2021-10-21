import {mat4, vec2, vec3, vec4} from 'gl-matrix';
import Object3D, {ObjectRaycastHit} from 'WebGL/Objects/Object3D';
import Camera from '../Camera/Camera';

export interface RayCastable {
  raycast(raycaster: RayCaster, transform: mat4): void;
}

export enum RayCasterMode {
  hitbox = 0,
  face = 1 << 0,
  edge = 1 << 1,
  point = 1 << 2,
}

/**
 * RayCaster class
 */
export default class RayCaster {
  private ray: Ray;
  private obj: Object3D | RayCastable;
  private mode: RayCasterMode;
  private recursion: boolean;
  private areaRange: number;
  public static readonly STANDARD_AREA_RANGE = 0.1;

  /**
   * Creates new RayCaster
   * @param {Ray} ray
   * @param {Object3D | RayCastable} obj
   * @param {RayCasterMode} mode
   * @param {boolean} recursion
   * @param {number} areaRange
   */
  constructor(ray: Ray, obj: Object3D | RayCastable,
      mode: RayCasterMode = RayCasterMode.hitbox,
      recursion = true, areaRange = 0.1) {
    this.ray = ray;
    this.obj = obj;
    this.mode = mode;
    this.recursion = recursion;
    this.areaRange = areaRange;
  }


  /**
   * Cast set ray
   * @param {mat4} initMatrix
   * @return {ObjectRaycastHit[] | null}
   */
  public cast(initMatrix?: mat4 | undefined): ObjectRaycastHit[] | null {
    if (this.obj instanceof Object3D) {
      const t = mat4.create();
      if (initMatrix !== undefined) mat4.copy(t, initMatrix);
      else mat4.copy(t, this.obj.getTransform().getTransformationMatrix());
      const hits = this.castObject3D(this.obj, t);
      return hits.filter((h): h is ObjectRaycastHit => h !== null);
    } else {
      console.log('not');
      return null;
    }
  }

  /**
   * Cast in case of Object3D
   * @param {Object3D} o
   * @param {mat4} transformMat
   * @return {(ObjectRaycastHit | null)[]}
   */
  private castObject3D(o: Object3D, transformMat: mat4):
      (ObjectRaycastHit | null)[] {
    let outArray: (ObjectRaycastHit | null)[] = [];
    outArray.push(o.raycast(this, transformMat));

    if (this.recursion) {
      o.getChildrenList().forEach((child) => {
        const tmpMat = mat4.create();
        mat4.mul(tmpMat, transformMat,
            child.getTransform().getTransformationMatrix());
        outArray = outArray.concat(this.castObject3D(child, tmpMat));
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

  /**
   * Get raycastable object
   * @return {Ray}
   */
  public getRaycastable(): Object3D | RayCastable {
    return this.obj;
  }

  /**
   * Set raycastable object
   * @param {Object3D | RayCastable} obj
   */
  public setRaycastable(obj: Object3D | RayCastable): void {
    this.obj = obj;
  }

  /**
   * Get area range of ray
   * @return {Ray}
   */
  public getAreaRange(): number {
    return this.areaRange;
  }

  /**
   * Set area range of ray
   * @param {number} areaRange
   */
  public setAreaRange(areaRange: number): void {
    this.areaRange = areaRange;
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
  vec4.transformMat4(direction4, direction4, camera.getUnProjectMatrix());
  const w = direction4[3] ? direction4[3] : 1;
  const direction = vec3.fromValues(
      direction4[0]/w,
      direction4[1]/w,
      direction4[2]/w);

  vec3.sub(direction, direction, origin);
  vec3.normalize(direction, direction);
  return new Ray(origin, direction);
}
