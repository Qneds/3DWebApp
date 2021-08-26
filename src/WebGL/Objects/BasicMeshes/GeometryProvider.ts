import {Edge, Face, Point} from './MeshUtils';

export interface GeometryProvider {
  getPoints(): Point[];
  getEdges(): Edge[];
  getFaces(): Face[];
}

/**
 * Simple geometry provide class
 */
export class SimpleProvider implements GeometryProvider {
  private points: Point[];
  private edges: Edge[];
  private faces: Face[];

  /**
   * Simple geometry constructor
   * @param {Point[]} points
   * @param {Edge[]} edges
   * @param {Face[]} faces
   */
  constructor(points: Point[], edges: Edge[], faces: Face[]) {
    this.points = points;
    this.edges = edges;
    this.faces = faces;
  }

  /**
   * @return {Point[]}
   */
  getPoints(): Point[] {
    return this.points;
  }

  /**
   * @return {Edge[]}
   */
  getEdges(): Edge[] {
    return this.edges;
  }

  /**
   * @return {Face[]}
   */
  getFaces(): Face[] {
    return this.faces;
  }
}
