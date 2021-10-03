import TOOL_STORAGE from 'components/toolsWIndow/ToolStorage';
import {mat4, quat, vec2, vec3, vec4} from 'gl-matrix';
import React from 'react';
import {Button, ButtonGroup, Input} from 'reactstrap';
import GLOBAL_COMPONENTS_REFRESH_EVENT from 'utils/RefreshEvent';
import Camera from 'WebGL/Camera/Camera';
import CameraController from 'WebGL/Camera/CameraController';
import GizmoManager, {GizmoModes} from 'WebGL/Editor/Gizmos/GizmoManager';
import {GizmoManipListener} from 'WebGL/Editor/Gizmos/GizmoManipEvent';
import {MoveTool, RotateTool, ScaleTool} from 'WebGL/Editor/Tools/Tools';
import {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';
import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';
import {FaceHit} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Object3D, {ObjectRaycastHit} from 'WebGL/Objects/Object3D';
import RayCaster, {createRayFromCamera, Ray, RayCasterMode}
  from 'WebGL/Raycast/RayCaster';
import {getClosestFaceOfObj, getClosestObj} from 'WebGL/Raycast/RayCastUtils';
import StandardRenderer from 'WebGL/Renderers/StandardRenderer';
import STATE from 'WebGL/State';
import {quatToEuler, rotate} from 'WebGL/utils.ts/Math';
import View from './View';

/**
 * Main view class
 */
export default class MainView extends View implements GizmoManipListener {
  private renderer: StandardRenderer;
  private obj: Object3D;
  private camera: Camera;
  private canvasEvent: CanvasEvent;
  private raycaster: RayCaster;
  private cameraController: CameraController;
  private gizmo: GizmoManager;

  private gizmoPoint: vec3;

  private leftMouseDown = false;

  /**
   * Creates Main View
   * @param {Object3D} obj
   * @param {CanvasEvent} canvasEvent
   */
  constructor(obj: Object3D, canvasEvent: CanvasEvent) {
    super();
    this.canvasEvent = canvasEvent;
    this.obj = obj;
    this.camera = new Camera();
    this.camera.setCanvasEvent(this.canvasEvent);
    this.renderer = new StandardRenderer(this.camera, this.obj);
    this.raycaster = new RayCaster(new Ray(), obj, RayCasterMode.face, true);
    this.cameraController =
        new CameraController(this.camera, this.raycaster);
    this.gizmo = new GizmoManager(this.camera, this.cameraController);
    this.gizmo.subscribeToGizmo(this);
    this.gizmoPoint = vec3.fromValues(0, 0, 0);
    this.recalculateGizmoPosition();
  }

  /**
   *
   */
  public renderView(): void {
    this.renderer.renderFrame();
    this.gizmo.render();
  }
  /**
   * @return {JSX.Element}
   */
  public returnOnScreenMenu(): JSX.Element {
    return (<MainOnScreenMenu/>);
  }

  /**
   * Sets new gizmo mode for this view
   * @param {GizmoModes} m
   */
  public setGizmoMode(m: GizmoModes): void {
    this.gizmo.setMode(m);
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event: MouseEvent): void {
    if (this.cameraController.isCameraActive()) return;
    if (this.leftMouseDown) return;
    this.leftMouseDown = true;

    const screenCords = vec2.fromValues(
        ( event.offsetX / this.camera.getScreenDimensions()[0]) * 2 - 1,
        - ( event.offsetY / this.camera.getScreenDimensions()[1]) * 2 + 1,
    );
    const ray = createRayFromCamera(screenCords, this.camera);
    this.raycaster.setRay(ray);
    if (this.gizmo.raycastGizmo(ray)) return;
    const s = getClosestObj(this.raycaster.cast());

    if (STATE.getSelectedObject()) {
      STATE.getSelectedObject()?.unselect();
      this.gizmo.inactivate();
    }
    STATE.setSelectedObject(s[0] ? s[0].hittedObject : null);
    if (s[0]?.hittedObject) {
      s[0]?.hittedObject.select();
      const newP = vec3.create();
      const tmp = vec3.create();
      vec3.copy(newP, mat4.getTranslation(tmp,
          s[0]?.hittedObject.getWorldTransformMatrix()));
      vec3.copy(this.gizmoPoint, newP);
      this.gizmo.setPoint(newP);
      this.gizmo.activate();
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event: MouseEvent): void {
    this.leftMouseDown = false;
  }

  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  onMove(dx: number, dy: number, dz: number): void {
    const transform = STATE.getSelectedObject()?.getTransform();
    const parent = STATE.getSelectedObject()?.getParent();
    const moveTool = TOOL_STORAGE.getToolByType(MoveTool);
    if (!transform) return;

    const tmp = vec4.create();
    if (parent) {
      const inv = mat4.create();
      mat4.invert(inv, parent.getWorldTransformMatrix());
      vec4.transformMat4(tmp, [dx, dy, dz, 0], inv);
    } else {
      vec4.copy(tmp, [dx, dy, dz, 0]);
    }

    const translatedTranslation = vec3.fromValues(tmp[0], tmp[1], tmp[2]);
    if (moveTool) {
      vec3.scale(translatedTranslation, translatedTranslation,
          moveTool.getProperties().getSpeedFactor());
    }
    const final = vec3.create();

    const prevTranslation = transform.getPositionInParent();
    transform.setPositionInParent(
        vec3.add(final, prevTranslation, translatedTranslation));
    const diff = vec3.fromValues(dx, dy, dz);
    if (moveTool) {
      vec3.scale(diff, diff, moveTool.getProperties().getSpeedFactor());
    }
    vec3.add(this.gizmoPoint, this.gizmoPoint, diff);
    this.gizmo.setPoint(this.gizmoPoint);

    GLOBAL_COMPONENTS_REFRESH_EVENT.refresh();
  }
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  onRotate(dx: number, dy: number, dz: number): void {
    const transform = STATE.getSelectedObject()?.getTransform();
    const parent = STATE.getSelectedObject()?.getParent();
    if (!transform) return;
    const rotateTool = TOOL_STORAGE.getToolByType(RotateTool);
    const c = vec3.fromValues(dx, dy, dz);
    if (rotateTool) {
      vec3.scale(c, c, rotateTool.getProperties().getSpeedFactor());
    }

    const tmp = rotate(c[0], c[1], c[2]);
    const rotated = mat4.create();
    if (parent) {
      const inv = mat4.create();
      mat4.invert(inv, parent.getWorldTransformMatrix());
      mat4.multiply(rotated, inv, tmp);
    } else {
      mat4.copy(rotated, tmp);
    }

    const tmpQuat = quat.create();
    mat4.getRotation(tmpQuat, rotated);
    const rotatedRotation = quatToEuler(tmpQuat);
    const final = vec3.create();

    const prevRotation = transform.getOrientationInParent();
    transform.setOrientationInParent(
        vec3.add(final, prevRotation, rotatedRotation));

    GLOBAL_COMPONENTS_REFRESH_EVENT.refresh();
  }
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  onScale(dx: number, dy: number, dz: number): void {
    const transform = STATE.getSelectedObject()?.getTransform();
    const parent = STATE.getSelectedObject()?.getParent();
    if (!transform) return;
    const change = vec3.fromValues(dx, dy, dz);
    const scaleTool = TOOL_STORAGE.getToolByType(ScaleTool);
    if (scaleTool) {
      vec3.scale(change, change, scaleTool.getProperties().getSpeedFactor());
    }

    const tmp = vec4.create();
    if (parent) {
      const inv = mat4.create();
      mat4.invert(inv, parent.getWorldTransformMatrix());
      vec4.transformMat4(tmp, [dx, dy, dz, 0], inv);
    } else {
      vec4.copy(tmp, [dx, dy, dz, 0]);
    }

    const scaledScaling = vec3.fromValues(tmp[0], tmp[1], tmp[2]);
    const final = vec3.create();

    const prevScale = transform.getScaleInParent();
    transform.setScaleInParent(vec3.add(final, prevScale, scaledScaling));

    GLOBAL_COMPONENTS_REFRESH_EVENT.refresh();
  }

  /**
   * Removes this obj from listeners list
   */
  public unsubscribe(): void {
    WebGLMouseEvent.unsubscribe(this);
    this.gizmo.cleanUp();
    this.cameraController.cleanUp();
  }

  /**
   * Recalculates position of gizmo in world space
   */
  public recalculateGizmoPosition(): void {
    const obj = STATE.getSelectedObject();
    const translated = vec3.create();
    this.gizmo.inactivate();
    if (obj) {
      mat4.getTranslation(translated, obj.getWorldTransformMatrix());
      vec3.copy(this.gizmoPoint, translated);
      this.gizmo.setPoint(this.gizmoPoint);
      this.gizmo.activate();
    }
  }
}

const MainOnScreenMenu = (): JSX.Element => {
  return (
    <>
    </>
  );
};
