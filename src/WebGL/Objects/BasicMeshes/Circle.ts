import {Edge, Face, Point} from './MeshUtils';
import {vec3} from 'gl-matrix';
import {GeometryProvider} from './GeometryProvider';

/**
 * Circle mesh class
 */
export class Circle implements GeometryProvider {
  private faces: Face[] = [];
  private edges: Edge[] = [];
  private points: Point[] = [];

  private outerRadius = 2;
  private innerRadius = 1;
  private radialSegments = 8;
  private thetaStart = 0;
  private thetaLength = Math.PI * 2;

  /**
   * Creates a new Cube mesh
   * @param {number} outerRadius
   * @param {number} innerRadius
   * @param {number} radialSegments
   * @param {number} thetaStart
   * @param {number} thetaLength
   */
  constructor(outerRadius = 2, innerRadius = 1, radialSegments = 8,
      thetaStart = 0, thetaLength = Math.PI * 2 ) {
    this.outerRadius = outerRadius;
    this.innerRadius= innerRadius;
    this.radialSegments = radialSegments;
    this.thetaStart = thetaStart;
    this.thetaLength = thetaLength;

    this.generateCircle();
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

  /**
   *
   */
  private generateCircle() {
    let index = 0;
    const outerPsI: number[] = [];
    const innerPsI: number[] = [];
    for ( let j = 0; j < this.radialSegments; j ++ ) {
      const v = j / this.radialSegments * this.thetaLength + this.thetaStart;

      const outerP = new Point([
        this.outerRadius * Math.cos(v),
        this.outerRadius * Math.sin(v),
        0]);
      this.points.push(outerP);
      outerPsI.push(index++);

      const innerP = new Point([
        this.innerRadius * Math.cos(v),
        this.innerRadius * Math.sin(v),
        0]);
      this.points.push(innerP);
      innerPsI.push(index++);
    }

    for ( let i = 0; i < this.radialSegments; i ++ ) {
      const pa = this.points[innerPsI[i]];
      const pb = this.points[innerPsI[(i+1)%this.radialSegments]];
      const pc = this.points[outerPsI[(i+1)%this.radialSegments]];
      const pd = this.points[outerPsI[i]];
      let edgeAB = new Edge(pa, pb);
      const findEAB = this.edges.find((e) => {
        return e.shallowEqual(edgeAB);
      });
      if (findEAB) {
        edgeAB = findEAB;
      } else {
        this.edges.push(edgeAB);
      }
      let edgeBD = new Edge(pb, pd);
      const findEBD = this.edges.find((e) => {
        return e.shallowEqual(edgeBD);
      });
      if (findEBD) {
        edgeBD = findEBD;
      } else {
        this.edges.push(edgeBD);
      }
      let edgeDA = new Edge(pd, pa);
      const findEDA = this.edges.find((e) => {
        return e.shallowEqual(edgeDA);
      });
      if (findEDA) {
        edgeDA = findEDA;
      } else {
        this.edges.push(edgeDA);
      }
      let edgeBC = new Edge(pb, pc);
      const findEBC = this.edges.find((e) => {
        return e.shallowEqual(edgeBC);
      });
      if (findEBC) {
        edgeBC = findEBC;
      } else {
        this.edges.push(edgeBC);
      }
      let edgeCD = new Edge(pc, pd);
      const findECD = this.edges.find((e) => {
        return e.shallowEqual(edgeCD);
      });
      if (findECD) {
        edgeCD = findECD;
      } else {
        this.edges.push(edgeCD);
      }

      // faces
      this.faces.push(new Face([edgeAB, edgeBD, edgeDA]));
      this.faces.push(new Face([edgeBC, edgeCD, edgeBD]));
    }
  }
}

/**
 * Circle builder class
 */
export class CircleBuilder {
  private outerRadius = 2;
  private innerRadius = 1;
  private radialSegments = 8;
  private thetaStart = 0;
  private thetaLength = Math.PI * 2;

  /**
   * Set radius
   * @param {number} outerRadius
   * @return {CircleBuilder}
   */
  public setOuterRadius(outerRadius: number): CircleBuilder {
    this.outerRadius = outerRadius;
    return this;
  }

  /**
   * Set height
   * @param {number} innerRadius
   * @return {CircleBuilder}
   */
  public setInnerRadius(innerRadius: number): CircleBuilder {
    this.innerRadius = innerRadius;
    return this;
  }

  /**
   * Set number of radial segments
   * @param {number} radialSegments
   * @return {CircleBuilder}
   */
  public setRadialSegments(radialSegments: number): CircleBuilder {
    this.radialSegments = radialSegments;
    return this;
  }

  /**
   * Set starting angle
   * @param {number} thetaStart
   * @return {CircleBuilder}
   */
  public setThetaStart(thetaStart: number): CircleBuilder {
    this.thetaStart = thetaStart;
    return this;
  }

  /**
   * Set angle length of cylinder
   * @param {number} thetaLength
   * @return {CircleBuilder}
   */
  public setThetaLength(thetaLength: number): CircleBuilder {
    this.thetaLength = thetaLength;
    return this;
  }

  /**
   * Builds circle mesh
   * @return {Circle}
   * @return {CircleBuilder}
   */
  public build(): Circle {
    return new Circle(this.outerRadius, this.innerRadius,
        this.radialSegments, this.thetaStart,
        this.thetaLength);
  }
}

const CircleInst = new Circle();
export default CircleInst;
