import {Edge, Face, Point} from './MeshUtils';
import {vec3} from 'gl-matrix';
import {GeometryBuilder, GeometryProvider} from './GeometryProvider';

/**
 * Cube mesh class
 */
export class Cube implements GeometryProvider {
  private faces: Face[] = [];
  private edges: Edge[] = [];
  private points: Point[] = [];

  /**
   * Creates new cube mesh
   * @param {number} xHalfWidth
   * @param {number} yHalfWidth
   * @param {number} zHalfWidth
   */
  constructor(xHalfWidth = 1, yHalfWidth = 1, zHalfWidth = 1) {
    this.points = [
      new Point([xHalfWidth, yHalfWidth, zHalfWidth]),
      new Point([xHalfWidth, yHalfWidth, -zHalfWidth]),

      new Point([xHalfWidth, -yHalfWidth, zHalfWidth]),
      new Point([xHalfWidth, -yHalfWidth, -zHalfWidth]),

      new Point([-xHalfWidth, yHalfWidth, zHalfWidth]),
      new Point([-xHalfWidth, yHalfWidth, -zHalfWidth]),

      new Point([-xHalfWidth, -yHalfWidth, zHalfWidth]),
      new Point([-xHalfWidth, -yHalfWidth, -zHalfWidth]),
    ];

    this.edges = [
      new Edge(this.points[6], this.points[2]), // Front // 0
      new Edge(this.points[2], this.points[0]), // 1
      new Edge(this.points[0], this.points[6]), // 2

      new Edge(this.points[4], this.points[6]), // 3


      new Edge(this.points[7], this.points[5]), // Back // 4
      new Edge(this.points[5], this.points[1]), // 5
      new Edge(this.points[1], this.points[7]), // 6

      new Edge(this.points[1], this.points[3]), // 7
      new Edge(this.points[3], this.points[7]), // 8


      new Edge(this.points[5], this.points[4]), // Top // 9
      new Edge(this.points[4], this.points[0]), // 10
      new Edge(this.points[0], this.points[5]), // 11

      new Edge(this.points[0], this.points[1]), // 12


      new Edge(this.points[3], this.points[2]), // Bottom // 13
      new Edge(this.points[2], this.points[7]), // 14

      new Edge(this.points[6], this.points[7]), // 15


      new Edge(this.points[0], this.points[3]), // Right // 16


      new Edge(this.points[4], this.points[7]), // Left // 17
    ];

    this.faces = [
      new Face([this.edges[0], this.edges[1], this.edges[2]]), // Front
      new Face([this.edges[2], this.edges[3], this.edges[10]]),

      new Face([this.edges[4], this.edges[5], this.edges[6]]), // Back
      new Face([this.edges[6], this.edges[7], this.edges[8]]),

      new Face([this.edges[9], this.edges[10], this.edges[11]]), // Top
      new Face([this.edges[11], this.edges[12], this.edges[5]]),

      new Face([this.edges[8], this.edges[13], this.edges[14]]), // Bottom
      new Face([this.edges[14], this.edges[0], this.edges[15]]),

      new Face([this.edges[7], this.edges[12], this.edges[16]]), // Right
      new Face([this.edges[16], this.edges[1], this.edges[13]]),

      new Face([this.edges[15], this.edges[3], this.edges[17]]), // Bottom
      new Face([this.edges[17], this.edges[9], this.edges[4]]),
    ];
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

/**
 * Cube builder class
 */
export class CubeBuilder implements GeometryBuilder {
  private xHalfWidth = 1;
  private yHalfWidth = 1;
  private zHalfWidth = 1;

  /**
   * Sets half width in x axis
   * @param {number} xHalfWidth
   * @return {CubeBuilder}
   */
  public setXHalfWidth(xHalfWidth: number): CubeBuilder {
    this.xHalfWidth = xHalfWidth;
    return this;
  }

  /**
   * Sets half  width in y axis
   * @param {number} yHalfWidth
   * @return {CubeBuilder}
   */
  public setYHalfWidth(yHalfWidth: number): CubeBuilder {
    this.yHalfWidth = yHalfWidth;
    return this;
  }

  /**
   * Sets half width in z axis
   * @param {number} zHalfWidth
   * @return {CubeBuilder}
   */
  public setZHalfWidth(zHalfWidth: number): CubeBuilder {
    this.zHalfWidth = zHalfWidth;
    return this;
  }

  /**
   * Builds new cube mesh
   * @return {Cube}
   */
  public build(): Cube {
    return new Cube(this.xHalfWidth, this.yHalfWidth, this.zHalfWidth);
  }
}

const CubeInst = new Cube();
export default CubeInst;
