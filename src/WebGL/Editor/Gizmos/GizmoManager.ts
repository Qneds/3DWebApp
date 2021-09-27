import {mat4, vec3, vec4} from 'gl-matrix';
import {abs} from 'mathjs';
import Camera from 'WebGL/Camera/Camera';
import CameraController from 'WebGL/Camera/CameraController';
import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';
import {Point} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Object3D from 'WebGL/Objects/Object3D';
import RayCaster, {Ray, RayCasterMode} from 'WebGL/Raycast/RayCaster';
import {getClosestObj} from 'WebGL/Raycast/RayCastUtils';
import {WebGL} from 'WebGL/WebGl';
import WebGLU from 'WebGL/WebGlUtils';
import {GizmoMove, GizmoRotate, GizmoScale} from './Gizmo';
import {GizmoManipEvent, GizmoManipListener} from './GizmoManipEvent';

export enum GizmoModes {
  move,
  rotate,
  scale
}

/**
 * Gizmo manager class
 */
export default class GizmoManager implements MouseListener {
  private moveGizmo: GizmoMove;
  private rotateGizmo: GizmoRotate;
  private scaleGizmo: GizmoScale;

  private camera: Camera;
  private cameraController: CameraController;

  private isActive = false;
  private mode: GizmoModes;
  private activeSubGizmo: 'x' | 'y' | 'z' | 'none' = 'none';
  private gizmoEvent = new GizmoManipEvent()

  private point: vec3;
  private distPointCam = 0;
  private raycaster: RayCaster;


  /**
   * Gizmo manager constructor
   * @param {Camera} camera
   * @param {CameraController} cameraController
   */
  constructor(camera: Camera, cameraController: CameraController) {
    this.moveGizmo = new GizmoMove();
    this.rotateGizmo = new GizmoRotate();
    this.scaleGizmo = new GizmoScale();
    this.camera = camera;
    this.cameraController = cameraController;
    this.point = vec3.fromValues(0, 0, 0);
    this.mode = GizmoModes.move;
    this.raycaster = new RayCaster(new Ray(), this.moveGizmo.getGizmo(),
        RayCasterMode.face, true);
    WebGLMouseEvent.subscribe(this);
  }

  /**
   * Activates gizmo
   */
  public activate(): void {
    this.isActive = true;
  }

  /**
   * Subscribes to this gizmo's events
   * @param {GizmoManipListener} l
   */
  public subscribeToGizmo(l: GizmoManipListener): void {
    this.gizmoEvent.subscribe(l);
  }

  /**
   * Unsubscribes from this gizmo's events
   * @param {GizmoManipListener} l
   */
  public unsubscribeToGizmo(l: GizmoManipListener): void {
    this.gizmoEvent.unsubscribe(l);
  }

  /**
   * Inactivates gizmo
   */
  public inactivate(): void {
    this.isActive = false;
  }

  /**
   * Sets new gizmo's starting position
   * @param {vec3} p
   */
  public setPoint(p: vec3): void {
    this.point = p;
  }

  /**
   * Sets gizmo's mode
   * @param {GizmoModes} m
   */
  public setMode(m: GizmoModes): void {
    this.mode = m;
  }

  /**
   * Gets gizmo's mode
   * @return {GizmoModes}
   */
  public getMode(): GizmoModes {
    return this.mode;
  }

  /**
   * Renders gizmo
   */
  public render(): void {
    if (!this.isActive) return;
    WebGLU.clearDepthBuffer();
    let toDraw = new Object3D();
    switch (this.mode) {
      case GizmoModes.move: {
        toDraw = this.moveGizmo.getGizmo();
        break;
      }
      case GizmoModes.rotate: {
        toDraw = this.rotateGizmo.getGizmo();
        break;
      }
      case GizmoModes.scale: {
        toDraw = this.scaleGizmo.getGizmo();
        break;
      }
    }
    const matrix = mat4.create();
    mat4.fromTranslation(matrix, this.point);
    const distV = vec3.create();
    vec3.sub(distV, this.camera.getPosition(), this.point);
    this.distPointCam = vec3.len(distV);
    const mDist = this.distPointCam*0.025;
    toDraw.getTransform().setScaleInParent([mDist, mDist, mDist]);
    toDraw.renderObj(this.camera, matrix, false);
  }

  /**
   * Raycasts gizmo to trigger event if active
   * @param {Ray} ray
   * @return {boolean}
   */
  public raycastGizmo(ray: Ray): boolean {
    if (!this.isActive) return false;
    this.raycaster.setRay(ray);

    let gizX = this.moveGizmo.getGizmoX();
    let gizY = this.moveGizmo.getGizmoY();
    let gizZ = this.moveGizmo.getGizmoZ();
    const obj = new Object3D();
    obj.getTransform().setPositionInParent(this.point);
    switch (this.mode) {
      case GizmoModes.move: {
        // this.raycaster.setRaycastable(this.moveGizmo.getGizmo());
        obj.addChild(this.moveGizmo.getGizmo());
        gizX = this.moveGizmo.getGizmoX();
        gizY = this.moveGizmo.getGizmoY();
        gizZ = this.moveGizmo.getGizmoZ();
        break;
      }
      case GizmoModes.rotate: {
        // this.raycaster.setRaycastable(this.rotateGizmo.getGizmo());
        obj.addChild(this.rotateGizmo.getGizmo());
        gizX = this.rotateGizmo.getGizmoX();
        gizY = this.rotateGizmo.getGizmoY();
        gizZ = this.rotateGizmo.getGizmoZ();
        break;
      }
      case GizmoModes.scale: {
        // this.raycaster.setRaycastable(this.scaleGizmo.getGizmo());
        obj.addChild(this.scaleGizmo.getGizmo());
        gizX = this.scaleGizmo.getGizmoX();
        gizY = this.scaleGizmo.getGizmoY();
        gizZ = this.scaleGizmo.getGizmoZ();
        break;
      }
    }
    const root = new Object3D();
    root.addChild(obj);
    this.raycaster.setRaycastable(root);
    const h = getClosestObj(this.raycaster.cast());

    if (!h[0]?.hittedObject) return false;

    let targetGizmoObj: Object3D | null= h[0]?.hittedObject;
    if (targetGizmoObj) {
      targetGizmoObj = targetGizmoObj.getParent();
    }
    console.log(gizX, targetGizmoObj);
    if (gizX === targetGizmoObj) this.activeSubGizmo = 'x';
    else if (gizY === targetGizmoObj) this.activeSubGizmo = 'y';
    else this.activeSubGizmo = 'z';

    this.cameraController.block();
    return true;
  }

  /**
   * Distinguish directions and actions on move gizmos
   * @param {number} dx
   * @param {number} dy
   */
  private handleCastMoveGizmo(dx: number, dy: number): void {
    const actDx = dx;
    const actDy = -dy;

    const moveDirVec = vec3.fromValues(0, 0, 0);

    if (this.activeSubGizmo === 'x') moveDirVec[0] = 1;
    else if (this.activeSubGizmo === 'y') moveDirVec[1] = 1;
    else if (this.activeSubGizmo === 'z') moveDirVec[2] = 1;

    let actModifier = actDx;
    if (Math.abs(actDy) > Math.abs(actDx)) actModifier = actDy;

    vec3.scale(moveDirVec, moveDirVec, this.distPointCam*0.001*actModifier);
    this.gizmoEvent.onMove(moveDirVec[0], moveDirVec[1], moveDirVec[2]);
  }

  /**
   * Distinguish directions and actions on rotate gizmos
   * @param {number} dx
   * @param {number} dy
   */
  private handleCastRotateGizmo(dx: number, dy: number): void {
    const actDx = dx;
    const actDy = -dy;

    const rotateDirVec = vec3.fromValues(0, 0, 0);

    if (this.activeSubGizmo === 'x') rotateDirVec[0] = 1;
    else if (this.activeSubGizmo === 'y') rotateDirVec[1] = 1;
    else if (this.activeSubGizmo === 'z') rotateDirVec[2] = 1;

    let actModifier = actDx;
    if (Math.abs(actDy) > Math.abs(actDx)) actModifier = actDy;

    vec3.scale(rotateDirVec, rotateDirVec, 0.01*actModifier);
    this.gizmoEvent.onRotate(rotateDirVec[0], rotateDirVec[1], rotateDirVec[2]);
  }

  /**
   * Distinguish directions and actions on scale gizmos
   * @param {number} dx
   * @param {number} dy
   */
  private handleCastScaleGizmo(dx: number, dy: number): void {
    const actDx = dx;
    const actDy = -dy;

    const scaleDirVec = vec3.fromValues(0, 0, 0);

    if (this.activeSubGizmo === 'x') scaleDirVec[0] = 1;
    else if (this.activeSubGizmo === 'y') scaleDirVec[1] = 1;
    else if (this.activeSubGizmo === 'z') scaleDirVec[2] = 1;

    const cameraInScaleDirVec =
      vec4.fromValues(1, 0, 0, 0);
    const im = mat4.create();
    mat4.invert(im, this.camera.getLookAtMatrix());
    vec4.transformMat4(cameraInScaleDirVec,
        cameraInScaleDirVec, im);
    const cameraOutScaleDirVec = vec3.fromValues(cameraInScaleDirVec[0],
        cameraInScaleDirVec[1], cameraInScaleDirVec[2]);
    vec3.normalize(cameraOutScaleDirVec, cameraOutScaleDirVec);

    const dot = vec3.dot(scaleDirVec, cameraOutScaleDirVec);

    /* if (dot < 0) {
      vec3.negate(scaleDirVec, scaleDirVec);
    } */

    let actModifier = actDx;
    if (Math.abs(actDy) > Math.abs(actDx)) actModifier = actDy;
    vec3.scale(scaleDirVec, scaleDirVec, this.distPointCam*0.001*actModifier);
    this.gizmoEvent.onScale(scaleDirVec[0], scaleDirVec[1], scaleDirVec[2]);
  }

  /**
   * @param {WheelEvent} event
   */
  onWheel(event: WheelEvent): void {
    return;
  }
  /**
   * @param {MouseEvent} event
   * @param {number} dx
   * @param {number} dy
   */
  onMouseMove(event: MouseEvent, dx: number, dy: number): void {
    if (this.activeSubGizmo === 'none' || !this.isActive ) return;

    switch (this.mode) {
      case GizmoModes.move: {
        this.handleCastMoveGizmo(dx, dy);
        break;
      }
      case GizmoModes.rotate: {
        this.handleCastRotateGizmo(dx, dy);
        break;
      }
      case GizmoModes.scale: {
        this.handleCastScaleGizmo(dx, dy);
        break;
      }
    }
  }
  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event: MouseEvent): void {
    return;
  }
  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event: MouseEvent): void {
    this.activeSubGizmo = 'none';
    this.cameraController.unblock();
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
  }
}
