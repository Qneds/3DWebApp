import {mat4, vec3} from 'gl-matrix';
import {calculateTransformationMatrix} from 'WebGL/utils.ts/Math';

/**
 * Transform class
 */
export class Transform {
  private positionInParent: vec3;
  private orientationInParent: vec3;
  private scaleInParent: vec3;

  private transformationMatrix: mat4;

  /**
   * Creates new transform
   * @param {vec3} positionInParent
   * @param {vec3} orientationInParent
   * @param {vec3} scaleInParent
   */
  constructor(positionInParent: vec3 = [0, 0, 0],
      orientationInParent: vec3 = [0, 0, 0],
      scaleInParent: vec3 = [1, 1, 1]) {
    this.positionInParent = positionInParent;
    this.orientationInParent = orientationInParent;
    this.scaleInParent = scaleInParent;
    this.transformationMatrix = calculateTransformationMatrix(
        positionInParent, orientationInParent, scaleInParent);
  }

  /**
   * Recalculate transform matrix
   */
  private updateTransformMatrix(): void {
    this.transformationMatrix = calculateTransformationMatrix(
        this.positionInParent, this.orientationInParent, this.scaleInParent);
  }

  /**
   * get position in parent space
   * @return {vec3}
   */
  public getPositionInParent(): vec3 {
    return this.positionInParent;
  }

  /**
   * get orientation in parent space
   * @return {vec3}
   */
  public getOrientationInParent(): vec3 {
    return this.orientationInParent;
  }

  /**
   * get scale in parent space
   * @return {vec3}
   */
  public getScaleInParent(): vec3 {
    return this.scaleInParent;
  }

  /**
   * set position in parent space
   * @param {vec3} position
   * @return {Transform}
   */
  public setPositionInParent(position: vec3): Transform {
    this.positionInParent = position;
    this.updateTransformMatrix();
    return this;
  }

  /**
   * set orientation in parent space
   * @param {vec3} orientation
   * @return {Transform}
   */
  public setOrientationInParent(orientation: vec3): Transform {
    this.orientationInParent = orientation;
    this.updateTransformMatrix();
    return this;
  }

  /**
   * set scale in parent space
   * @param {vec3} scale
   * @return {Transform}
   */
  public setScaleInParent(scale: vec3): Transform {
    this.scaleInParent = scale;
    this.updateTransformMatrix();
    return this;
  }

  /**
   * get Transformation matrix in parent
   * @return {vec3}
   */
  public getTransformationMatrix(): mat4 {
    return this.transformationMatrix;
  }
}
