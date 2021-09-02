import {vec2} from 'gl-matrix';
import React from 'react';
import {Button, ButtonGroup, Input} from 'reactstrap';
import Camera from 'WebGL/Camera/Camera';
import CameraController from 'WebGL/Camera/CameraController';
import {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';
import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';
import {FaceHit} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Object3D, {ObjectRaycastHit} from 'WebGL/Objects/Object3D';
import RayCaster, {createRayFromCamera, Ray, RayCasterMode}
  from 'WebGL/Raycast/RayCaster';
import {getClosestFaceOfObj} from 'WebGL/Raycast/RayCastUtils';
import StandardRenderer from 'WebGL/Renderers/StandardRenderer';
import STATE from 'WebGL/State';
import View from './View';

/**
 * Main view class
 */
export default class MainView extends View {
  private renderer: StandardRenderer;
  private obj: Object3D;
  private camera: Camera;
  private canvasEvent: CanvasEvent;
  private raycaster: RayCaster;
  private cameraController: CameraController;

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
  }

  /**
   *
   */
  public renderView(): void {
    this.renderer.renderFrame();
  }
  /**
   * @return {JSX.Element}
   */
  public returnOnScreenMenu(): JSX.Element {
    return (<MainOnScreenMenu/>);
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseClick(event: MouseEvent): void {
    if (this.cameraController.isCameraActive()) return;

    const screenCords = vec2.fromValues(
        ( event.offsetX / this.camera.getScreenDimensions()[0]) * 2 - 1,
        - ( event.offsetY / this.camera.getScreenDimensions()[1]) * 2 + 1,
    );
    const ray = createRayFromCamera(screenCords, this.camera);
    this.raycaster.setRay(ray);
    const s = this.getClosestObj(this.raycaster.cast());

    if (STATE.getSelectedObject()) {
      STATE.getSelectedObject()?.unselect();
    }
    STATE.setSelectedObject(s[0] ? s[0].hittedObject : null);
    if (s[0]?.hittedObject) {
      s[0]?.hittedObject.select();
    }
  }

  /**
   * @param {ObjectRaycastHit[] | null} arr
   * @return {PH}
   */
  private getClosestObj(arr: ObjectRaycastHit[] | null):
      [ObjectRaycastHit | null, FaceHit | null] {
    if (!arr) return [null, null];

    let closestObj: ObjectRaycastHit | null = null;
    let closestObjF: FaceHit | null = null;
    arr.forEach((h) => {
      if (!closestObj) {
        const closestFace = getClosestFaceOfObj(h.hits);
        if (closestFace) {
          closestObj = h;
          closestObjF = closestFace;
        }
      } else {
        const closestFace = getClosestFaceOfObj(h.hits);
        if (closestFace && closestObjF &&
            closestFace.distance < closestObjF.distance) {
          closestObj = h;
          closestObjF = closestFace;
        }
      }
    });
    return [closestObj, closestObjF];
  }
}

const MainOnScreenMenu = (): JSX.Element => {
  return (
    <>
    </>
  );
};
