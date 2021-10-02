import {Edge, Face, Point} from './MeshUtils';
import {vec3} from 'gl-matrix';
import {GeometryBuilder, GeometryProvider} from './GeometryProvider';

/**
 * Torus mesh class
 */
export class Torus implements GeometryProvider {
  private faces: Face[] = [];
  private edges: Edge[] = [];
  private points: Point[] = [];


  /**
   * Creates torus mesh
   * @param {number} radius
   * @param {number} tube
   * @param {number} radialSegments
   * @param {number} tubularSegments
   * @param {number} arc
   */
  constructor( radius = 1, tube = 0.4, radialSegments = 8,
      tubularSegments = 6, arc = Math.PI * 2 ) {
    radialSegments = Math.floor( radialSegments );
    tubularSegments = Math.floor( tubularSegments );


    for ( let j = 0; j <= radialSegments; j ++ ) {
      for ( let i = 0; i <= tubularSegments; i ++ ) {
        const u = i / tubularSegments * arc;
        const v = j / radialSegments * Math.PI * 2;

        this.points.push(new Point([
          (radius + tube * Math.cos(v) ) * Math.cos(u),
          (radius + tube * Math.cos(v) ) * Math.sin(u),
          tube * Math.sin(v)]));
      }
    }

    for ( let j = 1; j <= radialSegments; j ++ ) {
      for ( let i = 1; i <= tubularSegments; i ++ ) {
        const a = ( tubularSegments + 1 ) * j + i - 1;
        const b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
        const c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
        const d = ( tubularSegments + 1 ) * j + i;

        const pa = this.points[a];
        const pb = this.points[b];
        const pc = this.points[c];
        const pd = this.points[d];


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
 * Tours builder class
 */
export class TorusBuilder implements GeometryBuilder {
  private radius = 1;
  private tube = 0.4;
  private radialSegments = 8;
  private tubularSegments = 6;
  private arc = Math.PI * 2;

  /**
  * Set radius
  * @param {number} radius
  * @return {TorusBuilder}
  */
  public setRadius(radius: number): TorusBuilder {
    this.radius = radius;
    return this;
  }

  /**
   * Set radius of tube
   * @param {number} tube
   * @return {TorusBuilder}
   */
  public setTube(tube: number): TorusBuilder {
    this.tube = tube;
    return this;
  }

  /**
   * Set number of radial segments
   * @param {number} radialSegments
   * @return {TorusBuilder}
   */
  public setRadialSegments(radialSegments: number): TorusBuilder {
    this.radialSegments = radialSegments;
    return this;
  }

  /**
   * Set number of tubular segments
   * @param {number} tubularSegments
   * @return {TorusBuilder}
   */
  public setTubularSegments(tubularSegments: number): TorusBuilder {
    this.tubularSegments = tubularSegments;
    return this;
  }

  /**
   * Set angle length of tubular angle
   * @param {number} arc
   * @return {TorusBuilder}
   */
  public setArc(arc: number): TorusBuilder {
    this.arc = arc;
    return this;
  }

  /**
   * Builds torus mesh
   * @return {Torus}
   */
  public build(): Torus {
    return new Torus(this.radius, this.tube,
        this.radialSegments, this.tubularSegments,
        this.arc);
  }
}

const TorusInst = new Torus();
export default TorusInst;
