import {mat4, vec3} from 'gl-matrix';
import RayCaster from 'WebGL/Raycast/RayCaster';
import BasicShader from 'WebGL/Shaders/BasicShader';
import WebGLU from 'WebGL/WebGlUtils';

type Distance = {
  distance: number,
};

export type PointHit = {
  point: Point,
} & Distance;

export type EdgeHit = {
  edge: Edge,
} & Distance;

export type FaceHit = {
  face: Face,
} & Distance;

/**
 * Point class
 */
export class Point {
  private point: vec3;

  private vertexBuffer : WebGLBuffer | null = null;

  /**
   * Creates point from array
   * @param {vec3} cords
   */
  constructor(cords: vec3) {
    this.point = cords;
    this.vertexBuffer = WebGLU.createBuffer();
    this.recalculateBufferData();
  }

  /**
   * Return cord values
   * @return {vec3}
   */
  public getCords(): vec3 {
    return this.point;
  }

  /**
   * Sets cord values
   * @param {vec3} c
   * @return {void}
   */
  public setCords(c: vec3): void {
    this.point = c;
  }

  /**
   * Deep compare of points
   * @param {Point} p
   * @return {boolean}
   */
  public deepCompare(p: Point): boolean {
    return (this.point[0] === p.point[0]) &&
      (this.point[1] === p.point[1]) &&
      (this.point[2] === p.point[2]);
  }

  /**
   * Raycasts points
   * @param {RayCaster} raycaster
   * @param {mat4} transformMatrix
   * @return {PointHit | null}
   */
  public raycastPoint(raycaster: RayCaster, transformMatrix: mat4):
      PointHit | null {
    const pointMat = mat4.create();
    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, this.point);
    mat4.multiply(pointMat, transformMatrix, pointMat);

    const worldPoint = vec3.create();
    mat4.getTranslation(worldPoint, pointMat);

    const dir = raycaster.getRay().getDirection();
    const origin = raycaster.getRay().getOrigin();

    const tmp = vec3.create();
    const targetOriginVector = vec3.sub(tmp, worldPoint, origin);
    const distanceFromOriginToHit = vec3.dot(targetOriginVector, dir);

    if (distanceFromOriginToHit > 0) {
      const tmp1 = vec3.create();
      vec3.scale(tmp1, dir, distanceFromOriginToHit);
      const distance = vec3.length(vec3.sub(tmp, targetOriginVector, tmp1));

      const areaRange = distanceFromOriginToHit *
        raycaster.getAreaRange() * 0.1;
      if (distance < areaRange) {
        return {point: this, distance: distanceFromOriginToHit};
      }
    }
    return null;
  }

  /**
   * Draws this point
   * @param {BasicShader} shader
   */
  public drawPoint(shader: BasicShader): void {
    if (this.vertexBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.vertexBuffer);
      shader.enablePosition();
      WebGLU.drawArraysPoint(1);
    }
  }

  /**
   * Recalculates webgl buffer data to draw
   */
  public recalculateBufferData(): void {
    if (this.vertexBuffer) {
      WebGLU.uploadDataToBuffer(this.vertexBuffer, this.point as number[]);
    }
  }

  /**
   * Returns copy of this point
   * @return {Point}
   */
  public copy(): Point {
    const c = vec3.fromValues(this.point[0], this.point[1], this.point[2]);
    return new Point(c);
  }
}

/**
 * Edge class
 */
export class Edge {
  private p1: Point;
  private p2: Point;

  private vertexBuffer : WebGLBuffer | null = null;
  /**
   * Creates Edge from given points
   * @param {Point} p1
   * @param {Point} p2
   */
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;

    this.vertexBuffer = WebGLU.createBuffer();
    this.recalculateBufferData();
  }

  /**
   * Return Points in array
   * @return {Point[]}
   */
  public getPoints(): Point[] {
    return [this.p1, this.p2];
  }

  /**
   * Compare by point addresses
   * @param {Edge} e
   * @return {boolean}
   */
  public shallowEqual(e: Edge): boolean {
    return (this.p1 === e.p1 && this.p2 === e.p2) ||
      (this.p1 === e.p2 && this.p2 === e.p1);
  }

  /**
   *
   * @param {BasicShader} shader
   */
  public drawEdge(shader: BasicShader): void {
    if (this.vertexBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.vertexBuffer);
      shader.enablePosition();
      WebGLU.drawArraysEdge(2);
    }
  }

  /**
   * Raycasts edges
   * @param {RayCaster} raycaster
   * @param {mat4} transformMatrix
   * @return {EdgeHit | null}
   */
  public raycastEdge(raycaster: RayCaster, transformMatrix: mat4):
      EdgeHit | null {
    const worldP1 = vec3.create();
    const worldP2 = vec3.create();
    const pointMat = mat4.create();

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, this.p1.getCords());
    mat4.multiply(pointMat, transformMatrix, pointMat);
    mat4.getTranslation(worldP1, pointMat);

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, this.p2.getCords());
    mat4.multiply(pointMat, transformMatrix, pointMat);
    mat4.getTranslation(worldP2, pointMat);

    const dirPoints = vec3.create();
    const originPoints = worldP1;
    vec3.sub(dirPoints, worldP2, worldP1);
    vec3.normalize(dirPoints, dirPoints);


    const n = vec3.create();
    vec3.cross(n, dirPoints, raycaster.getRay().getDirection());
    if (vec3.length(n) === 0) {
      return null;
    }

    const diff = vec3.create();
    vec3.sub(diff, worldP1, raycaster.getRay().getOrigin());
    let distance = vec3.dot(n, diff)/vec3.length(n);
    distance = Math.abs(distance);


    // d2 -> dirPoint , p2 -> originPoints
    const tmp = vec3.create();
    const n2 = vec3.create();
    vec3.cross(n2, dirPoints, n);
    const distanceOnRay = vec3.dot(
        vec3.sub(tmp, originPoints, raycaster.getRay().getOrigin()), n2)/
        vec3.dot(raycaster.getRay().getDirection(), n2);
    if (distanceOnRay <= 0) {
      return null;
    }

    const areaRange = distanceOnRay * raycaster.getAreaRange() * 0.1;
    if (distance < areaRange) {
      const pointOnLine = vec3.create();
      const n1 = vec3.create();

      vec3.cross(n1, raycaster.getRay().getDirection(), n);
      vec3.scale(tmp, dirPoints,
          vec3.dot(vec3.sub(tmp, raycaster.getRay().getOrigin(),
              originPoints), n1)/
          vec3.dot(dirPoints, n1));

      vec3.add(pointOnLine, originPoints, tmp);

      const P1Cast = vec3.length(vec3.sub(tmp, pointOnLine, worldP1));
      const CastP2 = vec3.length(vec3.sub(tmp, worldP2, pointOnLine));
      const P1P2 = vec3.length(vec3.sub(tmp, worldP2, worldP1));

      if (P1Cast + CastP2 <= P1P2) {
        console.log(distance, areaRange);
        return {edge: this, distance: areaRange};
      }
    }
    return null;
  }

  /**
   * Recalculates webgl buffer data to draw
   */
  public recalculateBufferData(): void {
    if (this.vertexBuffer) {
      const tmpP1 = this.p1.getCords();
      const tmpP2 = this.p2.getCords();
      WebGLU.uploadDataToBuffer(this.vertexBuffer,
          [tmpP1[0], tmpP1[1], tmpP1[2], tmpP2[0], tmpP2[1], tmpP2[2]]);
    }
  }

  /**
   * Returns copy of this edge
   * @return {Edge}
   */
  public copy(): Edge {
    const p1 = this.getPoints()[0].copy();
    const p2 = this.getPoints()[1].copy();
    return new Edge(p1, p2);
  }
}

/**
 * Face class
 */
export class Face {
  private edges: [Edge, Edge, Edge];
  private vertexBuffer: WebGLBuffer | null;
  /**
   * Creates Face from given edges
   * @param {[Edge, Edge, Edge]} edges
   */
  constructor(edges: [Edge, Edge, Edge]) {
    this.edges = edges;

    this.vertexBuffer = WebGLU.createBuffer();
    this.recalculateBufferData();
  }

  /**
   * generates lines in form which can be drawn
   * @return {number[]}
   */
  private generateVertexesArray(): number[] {
    const pointsInEdges: Array<Point> = [];
    this.edges.forEach((edge) => {
      const [p1, p2] = edge.getPoints();
      let findP1 = pointsInEdges.find((p) => p === p1);
      let findP2 = pointsInEdges.find((p) => p === p2);
      if (!findP1) {
        findP1 = p1;
      }
      if (!findP2) {
        findP2 = p2;
      }
      if (pointsInEdges.length === 0) {
        pointsInEdges.push(findP1);
        pointsInEdges.push(findP2);
        return;
      }
      if (findP1 === pointsInEdges[0] &&
          findP2 !== pointsInEdges[pointsInEdges.length - 1]) {
        pointsInEdges.unshift(findP2);
      } else if (findP1 === pointsInEdges[pointsInEdges.length - 1] &&
          findP2 !== pointsInEdges[0]) {
        pointsInEdges.push(findP2);
      } else if (findP2 === pointsInEdges[0] &&
          findP1 !== pointsInEdges[pointsInEdges.length - 1]) {
        pointsInEdges.unshift(findP1);
      } else if (findP2 === pointsInEdges[pointsInEdges.length - 1] &&
          findP1 !== pointsInEdges[0]) {
        pointsInEdges.push(findP1);
      }
    });
    const vertices: number[][] = [];
    pointsInEdges.forEach((p) => {
      const vec = p.getCords();
      vertices.push([vec[0], vec[1], vec[2]]);
    });
    return vertices.flat();
  }

  /**
   * Return edges array
   * @return {Edge[]}
   */
  public getEdges(): Edge[] {
    return this.edges;
  }

  /**
   * Return points arrays
   * @return {Point[]}
   */
  public getPoints(): Point[] {
    const a = this.edges[0].getPoints()[0];
    const b = this.edges[0].getPoints()[1];
    const c = this.edges[1].getPoints()[0] !== this.edges[0].getPoints()[0] &&
      this.edges[1].getPoints()[0] !== this.edges[0].getPoints()[1]?
      this.edges[1].getPoints()[0] :
      this.edges[1].getPoints()[1];
    return [a, b, c];
  }
  /**
   * Draws this face
   * @param {BasicShader} shader
   */
  public drawFace(shader: BasicShader): void {
    if (this.vertexBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.vertexBuffer);
      shader.enablePosition();
      WebGLU.drawArraysTriangle(3);
    }
  }

  /**
   * Recalculates webgl buffer data to draw
   */
  public recalculateBufferData(): void {
    if (this.vertexBuffer) {
      WebGLU.uploadDataToBuffer(this.vertexBuffer,
          this.generateVertexesArray());
    }
  }

  /**
   * Raycasts faces
   * @param {RayCaster} raycaster
   * @param {mat4} transformMatrix
   * @return {FaceHit | null}
   */
  public raycastFace(raycaster: RayCaster, transformMatrix: mat4):
      FaceHit | null {
    const faceNormal = vec3.create();
    const tmp = vec3.create();
    const pointMat = mat4.create();
    const invTrans = mat4.create();
    mat4.invert(invTrans, transformMatrix);

    const localRayOrigin = vec3.create();
    const localRayDirection = vec3.create();

    const a = this.edges[0].getPoints()[0].getCords();
    const b = this.edges[0].getPoints()[1].getCords();
    const c = this.edges[1].getPoints()[0] !== this.edges[0].getPoints()[0] &&
      this.edges[1].getPoints()[0] !== this.edges[0].getPoints()[1]?
      this.edges[1].getPoints()[0].getCords() :
      this.edges[1].getPoints()[1].getCords();

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, raycaster.getRay().getOrigin());
    mat4.multiply(pointMat, invTrans, pointMat);
    mat4.getTranslation(localRayOrigin, pointMat);

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, raycaster.getRay().getDirection());
    pointMat[15] = 0;
    mat4.multiply(pointMat, invTrans, pointMat);
    mat4.getTranslation(localRayDirection, pointMat);

    // console.log(transformMatrix, raycaster.getRay(), worldA, worldB, worldC);

    const tmp1 = vec3.create();
    vec3.cross(faceNormal, vec3.sub(tmp1, b, a),
        vec3.sub(tmp, c, a));
    vec3.normalize(faceNormal, faceNormal);


    // if (vec3.dot(faceNormal, a) < 0) vec3.inverse(faceNormal, faceNormal);
    const d = vec3.dot(a, faceNormal);

    // double sided normals
    if (vec3.dot(localRayDirection, faceNormal) > 0) {
      vec3.negate(faceNormal, faceNormal);
    }

    const denominator = vec3.dot(localRayDirection, faceNormal);
    if (!denominator) {
      return null;
    }

    const numerator = -(vec3.dot(localRayOrigin, faceNormal) +
        d);
    const distance = numerator/denominator;
    if (distance <= 0) {
      return null;
    }

    const hitPoint = vec3.create();
    vec3.copy(hitPoint, localRayOrigin);
    vec3.scale(tmp, localRayDirection, distance);
    vec3.add(hitPoint, hitPoint, tmp);

    // vec3.cross(tmp, vec3.sub(tmp, worldB, worldA),
    //     vec3.sub(tmp1, hitPoint, worldA));
    const dot1 = this.testSide(hitPoint, a, b, c);

    vec3.cross(tmp, vec3.sub(tmp, c, b),
        vec3.sub(tmp1, hitPoint, b));
    const dot2 = this.testSide(hitPoint, b, c, a);

    vec3.cross(tmp, vec3.sub(tmp, a, c),
        vec3.sub(tmp1, hitPoint, c));
    // const dot3 = vec3.dot(tmp, faceNormal);
    const dot3 = this.testSide(hitPoint, c, a, b);
    if (dot1 && dot2 && dot3) {
      console.log(raycaster.getRay(), distance);
      console.log(dot1, dot2, dot3);
      console.log(hitPoint, a, b, c);
      return {face: this, distance: distance};
    }
    return null;
  }

  /**
   * Test on which side of line is vector
   * @param {vec3} p1
   * @param {vec3} p2
   * @param {vec3} a
   * @param {vec3} b
   * @return {boolean}
   */
  private testSide(p1: vec3, p2: vec3, a: vec3, b: vec3): boolean {
    const tmp1 = vec3.create();
    const tmp2 = vec3.create();

    const cp1 = vec3.create();
    const cp2 = vec3.create();
    vec3.cross(cp1, vec3.sub(tmp1, b, a), vec3.sub(tmp2, p1, a));
    vec3.cross(cp2, vec3.sub(tmp1, b, a), vec3.sub(tmp2, p2, a));
    if (vec3.dot(cp1, cp2) > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns copy of this face
   * @return {Face}
   */
  public copy(): Face {
    const points = this.getPoints().map((p) => {
      return p.copy();
    });
    const cpyE = this.edges.map((e) => {
      const pInE = e.getPoints();
      const p1I = this.getPoints().indexOf(pInE[0]);
      const p2I = this.getPoints().indexOf(pInE[1]);
      const p1 = points[p1I];
      const p2 = points[p2I];
      return new Edge(p1, p2);
    }) as [Edge, Edge, Edge];
    return new Face(cpyE);
  }
}
