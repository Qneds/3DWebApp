import EditModeContext from 'contexts/EditModeContext';
import {mat4, vec2, vec3} from 'gl-matrix';
import {mode} from 'mathjs';
import React, {useContext, useState} from 'react';
import {Button, ButtonGroup} from 'reactstrap';
import {GUIButton} from 'utils/GUI/GUIUtils';
import Camera from 'WebGL/Camera/Camera';
import CameraController from 'WebGL/Camera/CameraController';
import GizmoManager, {GizmoModes} from 'WebGL/Editor/Gizmos/GizmoManager';
import {GizmoManipListener} from 'WebGL/Editor/Gizmos/GizmoManipEvent';
import {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';
import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';
import {Edge, EdgeHit, Face, FaceHit, Point, PointHit}
  from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Object3D from 'WebGL/Objects/Object3D';
import RayCaster, {createRayFromCamera, Ray, RayCasterMode}
  from 'WebGL/Raycast/RayCaster';
import {getClosestEdgeOfObj, getClosestFaceOfObj, getClosestPointOfObj}
  from 'WebGL/Raycast/RayCastUtils';
import EditRenderer from 'WebGL/Renderers/EditRenderer';
import STATE from 'WebGL/State';
import {intersection, rotate} from 'WebGL/utils.ts/Math';
import View from './View';
import ViewManagerInst from './ViewManager';
import {AiOutlineLine} from 'react-icons/ai';
import {GiPlainSquare} from 'react-icons/gi';
import {HiOutlineDotsHorizontal} from 'react-icons/hi';
import {checkIfToolIsGizmoTool, IGizmoTool, MoveTool,
  RotateTool, ScaleTool} from 'WebGL/Editor/Tools/Tools';
import TOOL_STORAGE from 'components/toolsWIndow/ToolStorage';
import ToolsManagerInst from 'components/toolsWIndow/ToolsManager';

export enum EditViewMode {
  face = 'face',
  edge = 'edge',
  point = 'point',
}

/**
 * Edit view class
 */
export default class EditView extends View implements GizmoManipListener {
  private obj: Object3D;
  private camera: Camera;
  private canvasEvent: CanvasEvent;
  private raycaster: RayCaster;
  private renderer: EditRenderer;
  private cameraController: CameraController;

  private gizmo: GizmoManager;
  private gizmoPoint: vec3;
  private leftMouseDown = false;

  private mode: EditViewMode = EditViewMode.point;
  private selectedPoint: Point | null = null;
  private selectedEdge: Edge | null = null;
  private selectedFace: Face | null = null;

  private actualScaleFactor: vec3;
  private originalSelectedEdge: Edge | null = null;
  private originalSelectedFace: Face | null = null;

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
    this.gizmo = new GizmoManager(this.camera, this.cameraController);
    this.gizmo.subscribeToGizmo(this);
    this.gizmoPoint = vec3.fromValues(0, 0, 0);

    this.actualScaleFactor = vec3.create();
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
        this.raycaster.setMode(RayCasterMode.point | RayCasterMode.face);
        break;
      }
      case EditViewMode.edge: {
        this.raycaster.setMode(RayCasterMode.edge | RayCasterMode.face);
        break;
      }
      case EditViewMode.face: {
        this.raycaster.setMode(RayCasterMode.face);
        break;
      }
    }
    this.gizmo.setMode(GizmoModes.move);
    vec3.set(this.actualScaleFactor, 1, 1, 1);
    this.gizmo.inactivate();
  }

  /**
   * Sets new gizmo mode for this view
   * @param {GizmoModes} m
   */
  public setGizmoMode(m: GizmoModes): void {
    this.gizmo.setMode(m);
  }

  /**
   * @return {void}
   */
  public renderView(): void {
    this.renderer.renderFrame();
    this.gizmo.render();
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
    const h = this.raycaster.cast();

    this.unselectAll();
    this.gizmo.inactivate();
    vec3.set(this.actualScaleFactor, 1, 1, 1);
    if (h && h.length > 0) {
      const o = h[0];
      const f = getClosestFaceOfObj(o.hits);
      switch (this.mode) {
        case EditViewMode.point: {
          const p = getClosestPointOfObj(o.hits);
          this.handlePointHits(p, f, o.hittedObject);
          break;
        }
        case EditViewMode.edge: {
          const e = getClosestEdgeOfObj(o.hits);
          this.handleEdgeHits(e, f, o.hittedObject);
          break;
        }
        case EditViewMode.face: {
          this.handleFaceHits(f, o.hittedObject);
          break;
        }
      }
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event: MouseEvent): void {
    this.leftMouseDown = false;
  }

  /**
   * Unselects all faces, edges, pointss
   */
  private unselectAll(): void {
    this.selectedPoint = null;
    this.selectedEdge = null;
    this.selectedFace = null;
    this.originalSelectedEdge = null;
    this.originalSelectedFace = null;
    this.renderer.unselectPoint();
    this.renderer.unselectEdge();
    this.renderer.unselectFace();
  }

  /**
   * selects point
   * @param {PointHit | null} pointH
   * @param {FaceHit | null} faceH
   * @param {Object3D} obj
   */
  private handlePointHits(pointH: PointHit | null,
      faceH: FaceHit | null, obj: Object3D):
      void {
    if (pointH && (!faceH || (faceH && pointH.distance < faceH.distance))) {
      this.selectedPoint = pointH.point;
      ToolsManagerInst.getSelectedTool()
          ?.onSelectPoint(this.selectedPoint, obj);
      this.renderer.selectPoint(pointH.point);

      if (checkIfToolIsGizmoTool(ToolsManagerInst.getSelectedTool())) {
        this.updateCenterPoint(pointH.point);
        this.gizmo.activate();
      }
    } else {
      this.renderer.unselectPoint();
      this.selectedPoint = null;
      vec3.zero(this.gizmoPoint);
      this.gizmo.inactivate();
    }
    this.gizmo.setPoint(this.gizmoPoint);
  }

  /**
   * selects edge
   * @param {EdgeHit | null} edgeH
   * @param {FaceHit | null} faceH
   * @param {Object3D} obj
   */
  private handleEdgeHits(edgeH: EdgeHit | null,
      faceH: FaceHit | null, obj: Object3D): void {
    if (edgeH && (!faceH || (faceH && edgeH.distance < faceH.distance))) {
      this.selectedEdge = edgeH.edge;
      ToolsManagerInst.getSelectedTool()?.onSelectEdge(this.selectedEdge, obj);
      this.renderer.selectEdge(edgeH.edge);

      if (checkIfToolIsGizmoTool(ToolsManagerInst.getSelectedTool())) {
        this.updateCenterPoint(edgeH.edge);
        this.gizmo.activate();
      }
    } else {
      this.renderer.unselectEdge();
      vec3.zero(this.gizmoPoint);
      this.selectedEdge = null;
      this.gizmo.inactivate();
    }
    this.gizmo.setPoint(this.gizmoPoint);
    this.originalSelectedEdge =
      this.selectedEdge ? this.selectedEdge.copy() : null;
  }

  /**
   * selects face
   * @param {FaceHit | null} faceH
   * @param {Object3D} obj
   */
  private handleFaceHits(faceH: FaceHit | null, obj: Object3D): void {
    if (faceH) {
      this.selectedFace = faceH.face;
      ToolsManagerInst.getSelectedTool()?.onSelectFace(this.selectedFace, obj);
      this.renderer.selectFace(faceH.face);

      if (checkIfToolIsGizmoTool(ToolsManagerInst.getSelectedTool())) {
        this.updateCenterPoint(faceH.face);
        this.gizmo.activate();
      }
    } else {
      this.renderer.unselectFace();
      vec3.zero(this.gizmoPoint);
      this.selectedFace = null;
      this.gizmo.inactivate();
    }
    this.gizmo.setPoint(this.gizmoPoint);
    this.originalSelectedFace =
      this.selectedFace ? this.selectedFace.copy() : null;
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
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   * @return {void}
   */
  onMove(dx: number, dy: number, dz: number): void {
    const tmp = vec3.create();
    const change = vec3.fromValues(dx, dy, dz);
    const moveTool = TOOL_STORAGE.getToolByType(MoveTool);
    if (moveTool) {
      vec3.scale(change, change, moveTool.getProperties().getSpeedFactor());
    }
    vec3.add(
        tmp,
        this.gizmoPoint,
        change);
    this.gizmoPoint = tmp;
    this.gizmo.setPoint(tmp);

    switch (this.mode) {
      case EditViewMode.point: {
        if (this.selectedPoint) {
          this.selectedPoint.setCords(tmp);
          const pA = [this.selectedPoint];
          this.refreshMeshBuffer(pA);
        }
        break;
      }
      case EditViewMode.edge: {
        if (this.selectedEdge) {
          const points = this.selectedEdge.getPoints();
          points.forEach((point) => {
            const newC = vec3.create();
            vec3.add(newC, point.getCords(), change);
            point.setCords(newC);
          });
          this.refreshMeshBuffer(points);
        }
        break;
      }
      case EditViewMode.face: {
        if (this.selectedFace) {
          const points = this.selectedFace.getPoints();
          points.forEach((point) => {
            const newC = vec3.create();
            vec3.add(newC, point.getCords(), change);
            point.setCords(newC);
          });
          this.refreshMeshBuffer(points);
        }
        break;
      }
    }
  }
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   * @return {void}
   */
  onRotate(dx: number, dy: number, dz: number): void {
    const invGP = vec3.create();
    const transInv = mat4.create();
    const trans = mat4.create();
    mat4.fromTranslation(transInv, vec3.negate(invGP, this.gizmoPoint));
    mat4.fromTranslation(trans, this.gizmoPoint);

    const rotateTool = TOOL_STORAGE.getToolByType(RotateTool);
    const c = vec3.fromValues(dx, dy, dz);
    if (rotateTool) {
      vec3.scale(c, c, rotateTool.getProperties().getSpeedFactor());
    }

    const rotateMat = rotate(c[0], c[1], c[2]);

    switch (this.mode) {
      case EditViewMode.edge: {
        if (this.selectedEdge) {
          const points = this.selectedEdge.getPoints();
          points.forEach((point) => {
            const newC = vec3.create();
            const transformedC = vec3.create();
            vec3.transformMat4(transformedC, point.getCords(), transInv);
            vec3.transformMat4(newC, transformedC, rotateMat);
            vec3.transformMat4(newC, newC, trans);
            point.setCords(newC);
          });
          this.refreshMeshBuffer(points);
        }
        break;
      }
      case EditViewMode.face: {
        if (this.selectedFace) {
          const points = this.selectedFace.getPoints();
          points.forEach((point) => {
            const newC = vec3.create();
            const transformedC = vec3.create();
            vec3.transformMat4(transformedC, point.getCords(), transInv);
            vec3.transformMat4(newC, transformedC, rotateMat);
            vec3.transformMat4(newC, newC, trans);
            point.setCords(newC);
          });
          this.refreshMeshBuffer(points);
        }
        break;
      }
    }
  }
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   * @return {void}
   */
  onScale(dx: number, dy: number, dz: number): void {
    const change = vec3.fromValues(dx, dy, dz);
    const scaleTool = TOOL_STORAGE.getToolByType(ScaleTool);
    if (scaleTool) {
      vec3.scale(change, change, scaleTool.getProperties().getSpeedFactor());
    }

    const invGP = vec3.create();
    const transInv = mat4.create();
    const trans = mat4.create();
    const scaleMat = mat4.create();
    mat4.fromTranslation(transInv, vec3.negate(invGP, this.gizmoPoint));
    mat4.fromTranslation(trans, this.gizmoPoint);

    vec3.add(this.actualScaleFactor, this.actualScaleFactor, change);
    mat4.fromScaling(scaleMat, this.actualScaleFactor);

    switch (this.mode) {
      case EditViewMode.edge: {
        if (this.originalSelectedEdge && this.selectedEdge) {
          const points = this.originalSelectedEdge.getPoints();
          const actPoints = this.selectedEdge?.getPoints();
          if (!actPoints) return;
          points.forEach((point, i) => {
            const pointToSet = actPoints[i];
            if (!pointToSet) return;
            const newC = vec3.create();
            const transformedC = vec3.create();
            vec3.transformMat4(transformedC, point.getCords(), transInv);
            vec3.transformMat4(newC, transformedC, scaleMat);
            vec3.transformMat4(newC, newC, trans);
            pointToSet.setCords(newC);
          });
          this.refreshMeshBuffer(actPoints);
        }
        break;
      }
      case EditViewMode.face: {
        if (this.originalSelectedFace && this.selectedFace) {
          const points = this.originalSelectedFace.getPoints();
          const actPoints = this.selectedFace?.getPoints();
          if (!actPoints) return;
          points.forEach((point, i) => {
            const pointToSet = actPoints[i];
            if (!pointToSet) return;
            console.log(pointToSet);
            const newC = vec3.create();
            const transformedC = vec3.create();
            vec3.transformMat4(transformedC, point.getCords(), transInv);
            vec3.transformMat4(newC, transformedC, scaleMat);
            vec3.transformMat4(newC, newC, trans);
            pointToSet.setCords(newC);
          });
          this.refreshMeshBuffer(actPoints);
        }
        break;
      }
    }
  }

  /**
   * Updates gizmo's center point
   * @param {Point | Edge | Face} o
   */
  private updateCenterPoint(o: Point | Edge | Face): void {
    if (o instanceof Point) {
      vec3.copy(this.gizmoPoint, o.getCords());
    } else {
      let x = 0;
      let y = 0;
      let z = 0;
      const points = o.getPoints();
      points.map((p) => {
        x += p.getCords()[0];
        y += p.getCords()[1];
        z += p.getCords()[2];
      });
      x = x/o.getPoints().length;
      y = y/o.getPoints().length;
      z = z/o.getPoints().length;
      this.gizmoPoint = vec3.fromValues(x, y, z);
    }
  }

  /**
   * Refreshes meshes geometry buffer for faces edges and given points.
   * Buffer will be refreshed if geometry contains one of given points.
   * @param {Point[]} dependentPoints
   */
  private refreshMeshBuffer(dependentPoints: Point[]): void {
    dependentPoints.forEach((point) =>{
      point.recalculateBufferData();
    });
    this.obj.getMesh()?.getEdges().forEach((edge) => {
      const int = intersection(dependentPoints, edge.getPoints());
      if (int.length > 0) {
        edge.recalculateBufferData();
      }
    });
    this.obj.getMesh()?.getFaces().forEach((face) => {
      const int = intersection(dependentPoints, face.getPoints());
      if (int.length > 0) {
        face.recalculateBufferData();
      }
    });
    this.obj.getMesh()?.refreshBuffers();
  }
}

const EditOnScreenMenu = (): JSX.Element => {
  const workingEditMode = useContext(EditModeContext);

  const setMode = (mode: EditViewMode) => {
    workingEditMode?.setEditMode(mode);
    (ViewManagerInst.returnView() as EditView)
        .setMode(mode);
    // setWorkingMode(mode);
  };

  return (
    <>
      <ButtonGroup style={{
        marginTop: '0.7rem',
        marginLeft: '0.7rem',
        borderRadius: '0.5rem',
      }}>
        <GUIButton onClick={() => {
          if (!workingEditMode ||
            workingEditMode.editMode === EditViewMode.point) return;
          setMode(EditViewMode.point);
        } }
        active={(workingEditMode !== null &&
          workingEditMode.editMode === EditViewMode.point)}
        ico={<HiOutlineDotsHorizontal style={{transform: 'rotate(45deg)'}}/>}/>

        <GUIButton onClick={() => {
          if (!workingEditMode ||
            workingEditMode.editMode === EditViewMode.edge) return;
          setMode(EditViewMode.edge);
        } }
        active={(workingEditMode !== null &&
          workingEditMode.editMode === EditViewMode.edge)}
        ico={<AiOutlineLine style={{transform: 'rotate(45deg)'}}/>}/>

        <GUIButton onClick={() => {
          if (!workingEditMode ||
            workingEditMode.editMode === EditViewMode.face) return;
          setMode(EditViewMode.face);
        } }
        active={(workingEditMode !== null &&
          workingEditMode.editMode === EditViewMode.face)}
        ico={<GiPlainSquare/>}/>
      </ButtonGroup>
    </>
  );
};
