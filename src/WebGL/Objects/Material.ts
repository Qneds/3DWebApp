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

/**
 *
 */
class SpecialMaterials {
  private selectedObjMat: ObjectMaterial | null = null;
  private selectedFaceMat: ObjectMaterial | null = null;
  private selectedEdgeMat: ObjectMaterial | null = null;
  private selectedPointMat: ObjectMaterial | null = null;

  /**
   * Inits predefined materials
   */
  public init() {
    this.selectedObjMat = new ObjectMaterial();
    this.selectedObjMat.getFaceMaterial()
        .setColor([255/255, 158/255, 89/255, 1]);
    this.selectedObjMat.getEdgeMaterial().setColor([214/255, 89/255, 0, 1]);

    this.selectedFaceMat = new ObjectMaterial();
    this.selectedFaceMat.getFaceMaterial()
        .setColor([255/255, 158/255, 89/255, 1]);

    this.selectedEdgeMat = new ObjectMaterial();
    this.selectedEdgeMat.getEdgeMaterial().setColor([214/255, 89/255, 0, 1]);

    this.selectedPointMat = new ObjectMaterial();
    this.selectedPointMat.getPointMaterial()
        .setColor([186/255, 105/255, 47/255, 1]);
  }

  /**
   * Returns material which colors selected object
   * @return {ObjectMaterial | null}
   */
  public getSelectedObjectMaterial(): ObjectMaterial | null {
    return this.selectedObjMat;
  }

  /**
   * Returns material which colors selected face
   * @return {ObjectMaterial | null}
   */
  public getSelectedFaceMaterial(): ObjectMaterial | null {
    return this.selectedFaceMat;
  }

  /**
   * Returns material which colors selected edge
   * @return {ObjectMaterial | null}
   */
  public getSelectedEdgeMaterial(): ObjectMaterial | null {
    return this.selectedEdgeMat;
  }

  /**
   * Returns material which colors selected point
   * @return {ObjectMaterial | null}
   */
  public getSelectedPointMaterial(): ObjectMaterial | null {
    return this.selectedPointMat;
  }
}

export const SPECIAL_MATERIALS = new SpecialMaterials();
