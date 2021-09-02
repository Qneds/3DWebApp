import {vec2} from 'gl-matrix';
import React, {useState} from 'react';
import {Button, ButtonGroup} from 'reactstrap';
import Camera from 'WebGL/Camera/Camera';
import CameraController from 'WebGL/Camera/CameraController';
import {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';
import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';
import {Edge, Face, Point} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Object3D from 'WebGL/Objects/Object3D';
import RayCaster, {createRayFromCamera, Ray, RayCasterMode}
  from 'WebGL/Raycast/RayCaster';
import EditRenderer from 'WebGL/Renderers/EditRenderer';
import STATE from 'WebGL/State';
import View from './View';
import ViewManagerInst from './ViewManager';


export enum EditViewMode {
  face = 'face',
  edge = 'edge',
  point = 'point',
}

/**
 * Edit view class
 */
export default class EditView extends View {
  private obj: Object3D;
  private camera: Camera;
  private canvasEvent: CanvasEvent;
  private raycaster: RayCaster;
  private renderer: EditRenderer;
  private cameraController: CameraController;

  private mode: EditViewMode = EditViewMode.point;
  private selectedPoint: Point | null = null;
  private selectedEdge: Edge | null = null;
  private selectedFace: Face | null = null;

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
    this.renderer = new EditRenderer(this.camera, this.obj);
    this.raycaster = new RayCaster(new Ray(), obj, RayCasterMode.point, false);
    this.cameraController =
        new CameraController(this.camera, this.raycaster);
    WebGLMouseEvent.subscribe(this);
  }

  /**
   * sets mode of view
   * @param {EditViewMode} mode
   */
  public setMode(mode: EditViewMode): void {
    this.mode = mode;
    this.unselectAll();
    switch (mode) {
      case EditViewMode.point: {
        this.raycaster.setMode(RayCasterMode.point);
        break;
      }
      case EditViewMode.edge: {
        this.raycaster.setMode(RayCasterMode.edge);
        break;
      }
      case EditViewMode.face: {
        this.raycaster.setMode(RayCasterMode.face);
        break;
      }
    }
  }

  /**
   * @return {void}
   */
  public renderView(): void {
    this.renderer.renderFrame();
  }
  /**
   * @return {JSX.Element}
   */
  public returnOnScreenMenu(): JSX.Element {
    return (<EditOnScreenMenu/>);
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
    const h = this.raycaster.cast();

    if (h && h.length > 0) {
      const o = h[0].hits.pointsHits;
    } else {
      this.unselectAll();
    }
  }

  /**
   * Unselects all faces, edges, pointss
   */
  private unselectAll(): void {
    this.selectedPoint = null;
    this.selectedEdge = null;
    this.selectedFace = null;
    this.renderer.unselectPoint();
    this.renderer.unselectEdge();
    this.renderer.unselectFace();
  }

  /**
   * g
   * @param {PointHit[]} arr
   */
  private handlePointHits(arr: Point[]): void {
    return;
  }
}

const EditOnScreenMenu = (): JSX.Element => {
  const [workingMode, setWorkingMode] = useState(0);

  const setMode = (mode: number) => {
    setWorkingMode(mode);
  };

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => {
          if (workingMode === 0) return;
          setMode(0);
          (ViewManagerInst.returnView() as EditView)
              .setMode(EditViewMode.point);
        }}
        active={workingMode === 0}>p</Button>

        <Button onClick={() => {
          if (workingMode === 1) return;
          setMode(1);
          (ViewManagerInst.returnView() as EditView)
              .setMode(EditViewMode.edge);
        }}
        active={workingMode === 1}>e</Button>

        <Button onClick={() => {
          if (workingMode === 2) return;
          setMode(2);
          (ViewManagerInst.returnView() as EditView)
              .setMode(EditViewMode.face);
        }}
        active={workingMode === 2}>f</Button>
      </ButtonGroup>
    </>
  );
};
