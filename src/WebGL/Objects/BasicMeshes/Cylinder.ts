import {Edge, Face, Point} from './MeshUtils';
import {vec3} from 'gl-matrix';
import {GeometryProvider} from './GeometryProvider';

/**
 * Cube mesh class
 */
export class Cylinder implements GeometryProvider {
  private faces: Face[] = [];
  private edges: Edge[] = [];
  private points: Point[] = [];

  private radiusTop = 1;
  private radiusBottom = 1;
  private height = 1;
  private radialSegments = 8;
  private heightSegments = 1;
  private openEnded = false;
  private thetaStart = 0;
  private thetaLength = Math.PI * 2;

  /**
   * Creates new Cylinder
   * @param {number} radiusTop
   * @param {number} radiusBottom
   * @param {number} height
   * @param {number} radialSegments
   * @param {number} heightSegments
   * @param {boolean} openEnded
   * @param {number} thetaStart
   * @param {number} thetaLength
   */
  constructor(radiusTop = 1, radiusBottom = 1, height = 1,
      radialSegments = 8, heightSegments = 1, openEnded = false,
      thetaStart = 0, thetaLength = Math.PI * 2 ) {
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.height = height;
    this.radialSegments = Math.floor(radialSegments);
    this.heightSegments = Math.floor(heightSegments);
    this.openEnded = openEnded;
    this.thetaStart = thetaStart;
    this.thetaLength = thetaLength;

    this.generateTorso();
    if ( this.openEnded === false ) {
      if ( radiusTop > 0 ) this.generateCap( true );
      if ( radiusBottom > 0 ) this.generateCap( false );
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

  /**
   * generates Torso
   */
  private generateTorso() {
    let index = 0;
    const indexArray:number[][] = [];
    const halfHeight = this.height / 2;

    for ( let y = 0; y <= this.heightSegments; y ++ ) {
      const indexRow: number[] = [];

      const v = y / this.heightSegments;

      const radius =
        v * ( this.radiusBottom - this.radiusTop ) + this.radiusTop;

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
      for ( let y = 0; y < this.heightSegments; y ++ ) {
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
  }

  /**
   * Generates base
   * @param {boolean} top
   */
  private generateCap(top: boolean) {
    const indexArray:number[][] = [];
    const halfHeight = this.height / 2;

    const radius = ( top === true ) ? this.radiusTop : this.radiusBottom;
    const sign = ( top === true ) ? 1 : - 1;
    let points: Point[] = [];

    try {
      points = (top === true) ? this.points.slice(0, this.radialSegments) :
        this.points.slice(this.points.length - this.radialSegments);
    } catch (e) {
      return;
    }

    const center = new Point([0, halfHeight * sign, 0]);
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
 * Cylinder builder class
 */
export class CylinderBuilder {
  private radiusTop = 1;
  private radiusBottom = 1;
  private height = 1;
  private radialSegments = 8;
  private heightSegments = 1;
  private openEnded = false;
  private thetaStart = 0;
  private thetaLength = Math.PI * 2;

  /**
   * Set radius top
   * @param {number} radiusTop
   * @return {CylinderBuilder}
   */
  public setRadiusTop(radiusTop: number): CylinderBuilder {
    this.radiusTop = radiusTop;
    return this;
  }

  /**
   * Set radius bottom
   * @param {number} radiusBottom
   * @return {CylinderBuilder}
   */
  public setRadiusBottom(radiusBottom: number): CylinderBuilder {
    this.radiusBottom = radiusBottom;
    return this;
  }

  /**
   * Set height
   * @param {number} height
   * @return {CylinderBuilder}
   */
  public setHeight(height: number): CylinderBuilder {
    this.height = height;
    return this;
  }

  /**
   * Set number of radial segments
   * @param {number} radialSegments
   * @return {CylinderBuilder}
   */
  public setRadialSegments(radialSegments: number): CylinderBuilder {
    this.radialSegments = radialSegments;
    return this;
  }

  /**
   * Set number of height segments
   * @param {number} heightSegments
   * @return {CylinderBuilder}
   */
  public setHeightSegments(heightSegments: number): CylinderBuilder {
    this.heightSegments = heightSegments;
    return this;
  }

  /**
   * Set is cylinder opened
   * @param {boolean} openEnded
   * @return {CylinderBuilder}
   */
  public setOpenEnded(openEnded: boolean): CylinderBuilder {
    this.openEnded = openEnded;
    return this;
  }

  /**
   * Set starting angle
   * @param {number} thetaStart
   * @return {CylinderBuilder}
   */
  public setThetaStart(thetaStart: number): CylinderBuilder {
    this.thetaStart = thetaStart;
    return this;
  }

  /**
   * Set angle length of cylinder
   * @param {number} thetaLength
   * @return {CylinderBuilder}
   */
  public setThetaLength(thetaLength: number): CylinderBuilder {
    this.thetaLength = thetaLength;
    return this;
  }

  /**
   * Builds cylinder mesh
   * @return {Cylinder}
   * @return {CylinderBuilder}
   */
  public build(): Cylinder {
    return new Cylinder(this.radiusTop, this.radiusBottom, this.height,
        this.radialSegments, this.heightSegments, this.openEnded,
        this.thetaStart, this.thetaLength);
  }
}

const CylinderInst = new Cylinder();
export default CylinderInst;
