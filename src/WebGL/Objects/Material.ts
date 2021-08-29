import {vec4} from 'gl-matrix';
import BasicShader from 'WebGL/Shaders/BasicShader';

/**
 * Material class
 */
export default class ObjectMaterial {
  private faceMaterial: Material;
  private edgeMaterial: Material;
  private pointMaterial: Material;

  /**
   * Creates new material
   * @param {Material} faceMaterial
   * @param {Material} edgeMaterial
   * @param {Material} pointMaterial
   */
  constructor(faceMaterial = new Material(),
      edgeMaterial = new Material(),
      pointMaterial = new Material()) {
    this.faceMaterial = faceMaterial;
    this.edgeMaterial = edgeMaterial;
    this.pointMaterial = pointMaterial;
  }

  /**
   * Returns face material
   * @return {Material}
   */
  public getFaceMaterial(): Material {
    return this.faceMaterial;
  }

  /**
   * Sets new face material
   * @param {Material} mat
   */
  public setFaceMaterial(mat: Material): void {
    this.faceMaterial = mat;
  }

  /**
   * Returns edge material
   * @return {Material}
   */
  public getEdgeMaterial(): Material {
    return this.edgeMaterial;
  }

  /**
   * Sets new edge material
   * @param {Material} mat
   */
  public setEdgeMaterial(mat: Material): void {
    this.edgeMaterial = mat;
  }

  /**
   * Returns point material
   * @return {Material}
   */
  public getPointMaterial(): Material {
    return this.pointMaterial;
  }

  /**
   * Sets new point material
   * @param {Material} mat
   */
  public setPointMaterial(mat: Material): void {
    this.pointMaterial = mat;
  }
}

/**
 * CLass representing subMaterial so mesh can have
 *  access to different materials
 */
export class Material {
  private shader: BasicShader;
  private color: vec4;

  /**
   * Creates new material
   * @param {BasicShader} shader
   * @param {vec4} color
   */
  constructor(shader: BasicShader = new BasicShader(),
      color: vec4 =[1.0, 1.0, 1.0, 1.0]) {
    this.shader = shader;
    this.color = color;
  }

  /**
   * enables material
   */
  public enableMaterial(): void {
    this.shader.enableAlbedo(this.color);
  }

  /**
   * Get shader
   * @return {BasicShader}
   */
  public getShader(): BasicShader {
    return this.shader;
  }

  /**
   * Sets color
   * @param {vec4} color
   */
  public setColor(color: vec4): void {
    this.color = color;
  }
}
