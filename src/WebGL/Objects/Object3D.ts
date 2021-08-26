import {Renderable} from 'WebGL/Renderers/Renderer';
import {vec3, mat4} from 'gl-matrix';
import Material from './Material';
import Mesh, {MeshRaycastHits} from './Mesh';
import Camera from 'WebGL/Camera/Camera';
import WebGLU from 'WebGL/WebGlUtils';
import BasicShader from 'WebGL/Shaders/BasicShader';
import CubeInst from './BasicMeshes/Cube';
import CylinderInst from './BasicMeshes/Cylinder';
import ConeInst from './BasicMeshes/Cone';
import TorusInst from './BasicMeshes/Torus';
import CircleInst from './BasicMeshes/Circle';
import {Transform} from 'WebGL/Objects/Transform';
import RayCaster, {RayCasterMode} from 'WebGL/Raycast/RayCaster';

export type ObjectRaycastHit = {
  hittedObject: Object3D,
  hits: MeshRaycastHits,
}

/**
 * Class representing 3D object to render
 */
export default class Object3D implements Renderable {
  private parent: Object3D | null;
  private children: Object3D[];

  private transform: Transform;

  private material: Material;
  private mesh: Mesh | null;

  /**
   * Create 3D object
   * @param {Transform} transform
   * @param {Object3D | null} parent
   * @param {Mesh | null} mesh
   */
  constructor(transform = new Transform(),
      parent: Object3D | null = null, mesh: Mesh | null = null) {
    this.parent = parent;
    this.children = [];
    this.transform = transform;

    this.material = new Material();
    // this.mesh = new Mesh();
    // this.mesh = new Mesh(CubeInst);
    // this.mesh = new Mesh(CylinderInst);
    // this.mesh = new Mesh(ConeInst);
    // this.mesh = new Mesh(TorusInst);
    // this.mesh = new Mesh(CircleInst);
    this.mesh = mesh;
  }

  /**
   *
   * @param {RayCaster} raycaster
   * @return {ObjectRaycastHit | null}
   */
  raycast(raycaster: RayCaster): ObjectRaycastHit | null {
    if (raycaster.getMode() === RayCasterMode.hitbox) {
      console.log('Implement hitbox on Obejct3D raycast');
      return null;
    } else {
      if (this.mesh !== null) {
        const h = {
          hittedObject: this,
          hits:
            this.mesh.raycastMesh(raycaster, this.getWorldTransformMatrix()),
        };
        return h.hits.pointsHits.length <= 0 &&
            h.hits.edgesHits.length <= 0 &&
            h.hits.facesHits.length <= 0 ? null : h;
      }
      return null;
    }
  }


  /**
   * Adds object as a child of this object
   * @param {Object3D} object
   */
  public addChild(object: Object3D): void {
    this.children.push(object);
    this.setParent(object);
  }

  /**
   * Returns children list
   * @return {Object3D[]}
   */
  public getChildrenList(): Object3D[] {
    return this.children;
  }

  /**
   * sets parent of this object
   * @param {Object3D | null} object
   */
  public setParent(object: Object3D | null): void {
    this.parent = object;
  }

  /**
   * Returns object's parent
   * @return {Object3D[]}
   */
  public getParent(): Object3D | null {
    return this.parent;
  }

  /**
   * Returns object's parent
   * @return {mat4}
   */
  public getWorldTransformMatrix(): mat4 {
    const localTransform = this.transform.getTransformationMatrix();
    if (this.parent === null) {
      return localTransform;
    } else {
      const o = this.parent.getWorldTransformMatrix();
      return mat4.multiply(o, o, localTransform);
    }
  }


  /**
   * Sets new mesh for object
   * @param {Mesh} mesh
   */
  public setMesh(mesh: Mesh): void {
    this.mesh = mesh;
  }

  /**
   * Sets new material for object
   * @param {Material} material
   */
  public setMaterial(material: Material): void {
    this.material = material;
  }

  /**
   * Sets new transform for object
   * @param {Transform} transform
   */
  public setTransform(transform: Transform): void {
    this.transform = transform;
  }

  /**
   * Render this object
   * @param {Camera} camera
   * @param {mat4} transformationMatrixFromParent
   */
  public renderObj(camera: Camera, transformationMatrixFromParent: mat4): void {
    const transform = mat4.create();
    mat4.multiply(transform,
        transformationMatrixFromParent,
        this.transform.getTransformationMatrix());
    if (this.mesh) {
      const shader = this.material.getShader();
      shader.use();
      shader.enableViewProjectionMatrices(
          camera.getLookAtMatrix(),
          camera.getProjectionMatrix());
      this.material.enableMaterial();
      shader.enableTransformationMatrix(transform);
      this.mesh.useFaces(shader);
      /* const gl = WebGLU.returnWebGLContext();
      if (gl) {
        gl.drawElements(
            gl.TRIANGLES, this.mesh.getIndicesLength(),
            gl.UNSIGNED_INT, 0);
      }*/
      this.mesh.getPoints().forEach((p) => {
        p.drawPoint(shader);
      });
    }

    this.children.forEach((c) => {
      c.renderObj(camera, transform);
    });
  }
}
