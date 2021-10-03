import ToolsManagerInst from 'components/toolsWIndow/ToolsManager';
import React from 'react';
import {Edge, Face, Point} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Object3D from 'WebGL/Objects/Object3D';
import {MoveToolProperties, RotateToolProperties,
  ScaleToolProperties} from './ToolsProperties';

export interface ITool {
  renderToolPropertiesCard(): JSX.Element;
  onSelectPoint(point: Point, object: Object3D): void;
  onSelectEdge(edge: Edge, object: Object3D): void;
  onSelectFace(face: Face, object: Object3D): void;
  onSelectObject(object: Object3D): void;
  onToolSelect(): void;
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
  /**
   * return card to render in tool properties window
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return <div/>;
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
}

/**
 * Move Tool class
 */
export class MoveTool extends Tool implements IGizmoTool {
  private properties = new MoveToolProperties();


  /**
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return this.properties.drawPropertiesCard();
  }

  /**
   * returns properties object
   * @return {MoveToolProperties}
   */
  getProperties(): MoveToolProperties {
    return this.properties;
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
  private properties = new RotateToolProperties();

  /**
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return this.properties.drawPropertiesCard();
  }

  /**
   * returns properties object
   * @return {MoveToolProperties}
   */
  getProperties(): RotateToolProperties {
    return this.properties;
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
  private properties = new ScaleToolProperties();

  /**
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return this.properties.drawPropertiesCard();
  }

  /**
   * returns properties object
   * @return {MoveToolProperties}
   */
  getProperties(): ScaleToolProperties {
    return this.properties;
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
}
