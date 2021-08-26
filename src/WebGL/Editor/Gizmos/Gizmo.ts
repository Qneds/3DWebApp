/* eslint-disable prefer-const */
import {ConeBuilder} from 'WebGL/Objects/BasicMeshes/Cone';
import {CylinderBuilder} from 'WebGL/Objects/BasicMeshes/Cylinder';
import Mesh from 'WebGL/Objects/Mesh';
import Object3D from 'WebGL/Objects/Object3D';
import {Transform} from 'WebGL/Objects/Transform';
import {toRadians} from 'WebGL/utils.ts/Math';
import {buildMoveGizmoDir, buildRotateGizmoDir,
  buildScaleGizmoDir} from './GizmoUtils';

/**
 * Gizmo class
 */
export class Gizmo {
  private gizmoX: Object3D;
  private gizmoY: Object3D;
  private gizmoZ: Object3D;

  private main: Object3D;

  /**
   *
   */
  constructor() {
    this.main = new Object3D();

    // this.gizmoX = new Object3D();
    // this.gizmoY = new Object3D();
    // this.gizmoZ = new Object3D();

    // this.gizmoX = buildMoveGizmoDir(10, 1, 5, 2, 12, [1, 0, 0, 1]);
    // this.gizmoY = buildMoveGizmoDir(10, 1, 5, 2, 12, [0, 1, 0, 1]);
    // this.gizmoZ = buildMoveGizmoDir(10, 1, 5, 2, 12, [0, 0, 1, 1]);

    // this.gizmoX = buildRotateGizmoDir(10, 0.5, 26, 5, [1, 0, 0, 1]);
    // this.gizmoY = buildRotateGizmoDir(10, 0.5, 26, 5, [0, 1, 0, 1]);
    // this.gizmoZ = buildRotateGizmoDir(10, 0.5, 26, 5, [0, 0, 1, 1]);

    this.gizmoX = buildScaleGizmoDir(10, 1, 2, 12, [1, 0, 0, 1]);
    this.gizmoY = buildScaleGizmoDir(10, 1, 2, 12, [0, 1, 0, 1]);
    this.gizmoZ = buildScaleGizmoDir(10, 1, 2, 12, [0, 0, 1, 1]);

    let t = new Transform();
    t.setOrientationInParent([toRadians(90), 0, 0]);
    this.gizmoX.setTransform(t);
    this.main.addChild(this.gizmoX);

    t = new Transform();
    t.setOrientationInParent([0, toRadians(90), 0]);
    this.gizmoY.setTransform(t);
    this.main.addChild(this.gizmoY);

    t = new Transform();
    t.setOrientationInParent([0, 0, toRadians(90)]);
    this.gizmoZ.setTransform(t);
    this.main.addChild(this.gizmoZ);
  }

  /**
   * Returns gizmo 3D object
   * @return {Object3D}
   */
  public getGizmo(): Object3D {
    return this.main;
  }
}

const GizmoInst = new Gizmo();
export default GizmoInst;
