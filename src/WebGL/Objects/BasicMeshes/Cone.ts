import {Edge, Face, Point} from './MeshUtils';
import {vec3} from 'gl-matrix';
import {GeometryProvider} from './GeometryProvider';

/**
 * Cone mesh class
 */
export class Cone implements GeometryProvider {
  private faces: Face[] = [];
  private edges: Edge[] = [];
  private points: Point[] = [];

  private radius = 1;
  private height = 1;
  private radialSegments = 8;
  private heightSegments = 3;
  private thetaStart = 0;
  private thetaLength = Math.PI * 2;

  /**
   * Creates cone mesh
   * @param {number} radius
   * @param {number} height
   * @param {number} radialSegments
   * @param {number} heightSegments
   * @param {number} thetaStart
   * @param {number} thetaLength
   */
  constructor( radius = 1, height = 1, radialSegments = 8, heightSegments = 2,
      thetaStart = 0, thetaLength = Math.PI * 2 ) {
    this.radius = radius;
    this.height = height;
    this.radialSegments = Math.floor(radialSegments);
    this.heightSegments = Math.floor(heightSegments);
    this.thetaStart = thetaStart;
    this.thetaLength = thetaLength;

    this.generateTorso();
    this.generateBase();
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
  private generateBase() {
    const halfHeight = this.height / 2;
    const points: Point[] =
    this.points.slice(0, this.radialSegments);

    const center = new Point([0, -halfHeight, 0]);
    this.points.push(center);

    for ( let x = 0; x < this.radialSegments; x ++ ) {
      const outerEdge = new Edge(points[x], points[(x+1)%this.radialSegments]);
      let foundE = this.edges.find((e) => {
        return e.shallowEqual(outerEdge);
      });
      if (!foundE) {
        this.edges.push(outerEdge);
        foundE = outerEdge;
      }

      const l1 = new Edge(center, points[x]);
      const l2 = new Edge(center, points[(x+1)%this.radialSegments]);
      this.edges.push(l1);
      this.edges.push(l2);
      this.faces.push(new Face([l1, l2, foundE]));
    }
  }

  /**
   *
   */
  private generateTorso() {
    let index = 0;
    const indexArray:number[][] = [];
    const halfHeight = this.height / 2;

    for ( let y = 0; y <= this.heightSegments - 1; y ++ ) {
      const indexRow: number[] = [];

      const v = (this.heightSegments - y) / this.heightSegments;

      const radius =
        v * this.radius;

      for ( let x = 0; x <= this.radialSegments; x ++ ) {
        const u = x / this.radialSegments;

        const theta = u * this.thetaLength + this.thetaStart;

        const sinTheta = Math.sin( theta );
        const cosTheta = Math.cos( theta );

        // vertex
        this.points.push( new Point(
            [radius * sinTheta,
              - v * this.height + halfHeight,
              radius * cosTheta],
        ));
        indexRow.push( index ++ );
      }
      indexArray.push( indexRow );
    }

    for ( let x = 0; x < this.radialSegments; x ++ ) {
      for ( let y = 0; y < this.heightSegments - 1; y ++ ) {
        const a = indexArray[y][x];
        const b = indexArray[y + 1][x];
        const c = indexArray[y + 1][x + 1];
        const d = indexArray[y][x + 1];

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
    const points: Point[] =
      this.points.slice(this.points.length - this.radialSegments);

    const center = new Point([0, halfHeight, 0]);
    this.points.push(center);

    for ( let x = 0; x < this.radialSegments; x ++ ) {
      const outerEdge = new Edge(points[x], points[(x+1)%this.radialSegments]);
      let foundE = this.edges.find((e) => {
        return e.shallowEqual(outerEdge);
      });
      if (!foundE) {
        this.edges.push(outerEdge);
        foundE = outerEdge;
      }

      const l1 = new Edge(center, points[x]);
      const l2 = new Edge(center, points[(x+1)%this.radialSegments]);
      this.edges.push(l1);
      this.edges.push(l2);
      this.faces.push(new Face([l1, l2, foundE]));
    }
  }
}

/**
 * Cone builder class
 */
export class ConeBuilder {
  private radius = 1;
  private height = 1;
  private radialSegments = 8;
  private heightSegments = 3;
  private thetaStart = 0;
  private thetaLength = Math.PI * 2;

  /**
   * Set radius
   * @param {number} radius
   * @return {ConeBuilder}
   */
  public setRadius(radius: number): ConeBuilder {
    this.radius = radius;
    return this;
  }

  /**
   * Set height
   * @param {number} height
   * @return {ConeBuilder}
   */
  public setHeight(height: number): ConeBuilder {
    this.height = height;
    return this;
  }

  /**
   * Set number of radial segments
   * @param {number} radialSegments
   * @return {ConeBuilder}
   */
  public setRadialSegments(radialSegments: number): ConeBuilder {
    this.radialSegments = radialSegments;
    return this;
  }

  /**
   * Set number of height segments
   * @param {number} heightSegments
   * @return {ConeBuilder}
   */
  public setHeightSegments(heightSegments: number): ConeBuilder {
    this.heightSegments = heightSegments;
    return this;
  }

  /**
   * Set starting angle
   * @param {number} thetaStart
   * @return {ConeBuilder}
   */
  public setThetaStart(thetaStart: number): ConeBuilder {
    this.thetaStart = thetaStart;
    return this;
  }

  /**
   * Set angle length of cylinder
   * @param {number} thetaLength
   * @return {ConeBuilder}
   */
  public setThetaLength(thetaLength: number): ConeBuilder {
    this.thetaLength = thetaLength;
    return this;
  }

  /**
   * Builds cone mesh
   * @return {Cone}
   */
  public build(): Cone {
    return new Cone(this.radius, this.height,
        this.radialSegments, this.heightSegments,
        this.thetaStart, this.thetaLength);
  }
}

const ConeInst = new Cone();
export default ConeInst;
