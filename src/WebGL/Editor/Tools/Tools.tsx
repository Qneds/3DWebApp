import ToolsManagerInst from 'components/toolsWIndow/ToolsManager';
import React from 'react';
import {Edge, Face, Point} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Mesh from 'WebGL/Objects/Mesh';
import Object3D from 'WebGL/Objects/Object3D';
import {calculateCenterPoint, calculateIntersection} from 'WebGL/utils.ts/Math';
import {MoveToolProperties, RotateToolProperties,
  ScaleToolProperties,
  ToolProperties} from './ToolsProperties';

export interface ITool {
  renderToolPropertiesCard(): JSX.Element;
  onSelectPoint(point: Point, object: Object3D): void;
  onSelectEdge(edge: Edge, object: Object3D): void;
  onSelectFace(face: Face, object: Object3D): void;
  onSelectObject(object: Object3D): void;
  onToolSelect(): void;
  getProperties(): ToolProperties | null;
}

export interface IGizmoTool {
  gizmoTool(): void;
}

/**
 * Checks if tool is GizmoTool
 * @param {ITool} tool
 * @return {boolean}
 */
export function checkIfToolIsGizmoTool(tool: ITool | null): boolean {
  return tool !== null && 'gizmoTool' in tool;
}

/**
 * Base class for tools
 */
export class Tool implements ITool {
  protected properties: ToolProperties | null = null;
  /**
   * return card to render in tool properties window
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    if (this.properties) return this.properties.drawPropertiesCard();
    return (
      <div/>
    );
  }
  /**
   * method called on point select
   * @param {Point} point
   * @param {Object3D} object
   * @return {void}
   */
  onSelectPoint(point: Point, object: Object3D): void {
    return;
  }

  /**
   * method called on edge select
   * @param {Edge} edge
   * @param {Object3D} object
   * @return {void}
   */
  onSelectEdge(edge: Edge, object: Object3D): void {
    return;
  }

  /**
   * method called on face select
   * @param {Face} face
   * @param {Object3D} object
   * @return {void}
   */
  onSelectFace(face: Face, object: Object3D): void {
    return;
  }

  /**
   * method called on object select
   * @param {Object3D} object
   * @return {void}
   */
  onSelectObject(object: Object3D): void {
    return;
  }

  /**
   * method called ont this tool selection
   * @return {void}
   */
  onToolSelect(): void {
    return;
  }

  /**
   * Returns tool properties
   * @return {ToolsProperties | null}
   */
  getProperties(): ToolProperties | null {
    return this.properties;
  }
}

/**
 * Move Tool class
 */
export class MoveTool extends Tool implements IGizmoTool {
  /**
   */
  constructor() {
    super();
    this.properties = new MoveToolProperties();
  }

  /**
   *
   */
  gizmoTool(): void {
    return;
  }
}

/**
 * Rotate Tool class
 */
export class RotateTool extends Tool implements IGizmoTool {
  /**
   */
  constructor() {
    super();
    this.properties = new RotateToolProperties();
  }

  /**
   *
   */
  gizmoTool(): void {
    return;
  }
}

/**
 * Scale Tool class
 */
export class ScaleTool extends Tool implements IGizmoTool {
  /**
   */
  constructor() {
    super();
    this.properties = new ScaleToolProperties();
  }

  /**
   *
   */
  gizmoTool(): void {
    return;
  }
}

/**
 * Surface Subdivision tool class
 */
export class SurfaceSubdivisionTool extends Tool {
  /**
   * @param {Face} face
   */
  onSelectFace(face: Face): void {
    return;
  }

  /**
   * Subdivides given face in given mesh into 3 faces
   * @param {Face} face
   * @param {Mesh} mesh
   */
  public subdivideFace(face: Face, mesh: Mesh): void {
    const faces = mesh.getFaces();
    const indexOfDeletedFace = faces.indexOf(face);
    if (indexOfDeletedFace < 0) return;

    faces.splice(indexOfDeletedFace, 1);
    const newPoint = calculateCenterPoint(face.getPoints());

    const newEdges = face.getPoints().map((point) =>{
      return new Edge(point, newPoint);
    });

    const newFaces = face.getEdges().map((edge) => {
      const edgePoints = edge.getPoints();
      const newEdgesInFace: Edge[] = [edge];
      newEdges.forEach((newEdge) => {
        const intersection =
            calculateIntersection(edgePoints, newEdge.getPoints()).length;
        if (intersection > 0) {
          newEdgesInFace.push(newEdge);
        }
      });
      return new Face(newEdgesInFace as [Edge, Edge, Edge]);
    });

    mesh.getPoints().push(newPoint);
    mesh.getEdges().push(...newEdges);
    faces.push(...newFaces);

    mesh.refreshBuffers();
  }
}


