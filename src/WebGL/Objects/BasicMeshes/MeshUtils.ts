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
    if (this.vertexBuffer) {
      WebGLU.uploadDataToBuffer(this.vertexBuffer, this.point as number[]);
    }
  }

  /**
   * Return cord values
   * @return {vec3}
   */
  public getPoint(): vec3 {
    return this.point;
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

      if (distance < 0.1) {
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
      const gl = WebGLU.returnWebGLContext();
      if (gl) {
        gl.drawArrays(gl.POINTS, 0, 1);
      }
    }
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
    if (this.vertexBuffer) {
      const tmpP1 = this.p1.getPoint();
      const tmpP2 = this.p2.getPoint();
      WebGLU.uploadDataToBuffer(this.vertexBuffer,
          [tmpP1[0], tmpP1[1], tmpP1[2], tmpP2[0], tmpP2[1], tmpP2[2]]);
    }
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
      const gl = WebGLU.returnWebGLContext();
      if (gl) {
        gl.drawArrays(
            gl.LINES, 0, 2);
      }
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
    mat4.translate(pointMat, pointMat, this.p1.getPoint());
    mat4.multiply(pointMat, transformMatrix, pointMat);
    mat4.getTranslation(worldP1, pointMat);

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, this.p2.getPoint());
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
    if (distance < 0.1) {
      const tmp = vec3.create();
      const n2 = vec3.create();
      vec3.cross(n2, dirPoints, n);
      const distanceOnRay = vec3.dot(
          vec3.sub(tmp, originPoints, raycaster.getRay().getOrigin()), n2)/
        vec3.dot(raycaster.getRay().getDirection(), n2);
      if (distanceOnRay <= 0) {
        return null;
      }


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
        return {edge: this, distance: distanceOnRay};
      }
    }
    return null;
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
    if (this.vertexBuffer) {
      WebGLU.uploadDataToBuffer(this.vertexBuffer,
          this.generateVertexesArray());
    }
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
      const vec = p.getPoint();
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
   * Draws this face
   * @param {BasicShader} shader
   */
  public drawFace(shader: BasicShader): void {
    if (this.vertexBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.vertexBuffer);
      shader.enablePosition();
      const gl = WebGLU.returnWebGLContext();
      if (gl) {
        gl.drawArrays(
            gl.TRIANGLES, 0, 3);
      }
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

    const worldA = vec3.create();
    const worldB = vec3.create();
    const worldC = vec3.create();

    const a = this.edges[0].getPoints()[0].getPoint();
    const b = this.edges[0].getPoints()[1].getPoint();
    const c = this.edges[1].getPoints()[0] !== this.edges[0].getPoints()[0] &&
      this.edges[1].getPoints()[0] !== this.edges[0].getPoints()[1]?
      this.edges[1].getPoints()[0].getPoint() :
      this.edges[1].getPoints()[1].getPoint();

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, a);
    mat4.multiply(pointMat, transformMatrix, pointMat);
    mat4.getTranslation(worldA, pointMat);

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, b);
    mat4.multiply(pointMat, transformMatrix, pointMat);
    mat4.getTranslation(worldB, pointMat);

    mat4.identity(pointMat);
    mat4.translate(pointMat, pointMat, c);
    mat4.multiply(pointMat, transformMatrix, pointMat);
    mat4.getTranslation(worldC, pointMat);

    const tmp1 = vec3.create();
    vec3.cross(faceNormal, vec3.sub(tmp1, worldB, worldA),
        vec3.sub(tmp, worldC, worldA));
    vec3.normalize(faceNormal, faceNormal);

    const d = vec3.dot(worldA, faceNormal);

    const denominator = vec3.dot(raycaster.getRay().getDirection(), faceNormal);
    if (!denominator) {
      return null;
    }

    const numerator = -(vec3.dot(raycaster.getRay().getOrigin(), faceNormal) +
        d);
    const distance = numerator/denominator;
    if (distance <= 0) {
      return null;
    }

    const hitPoint = vec3.create();
    vec3.copy(hitPoint, raycaster.getRay().getOrigin());
    vec3.scale(tmp, raycaster.getRay().getDirection(), distance);
    vec3.add(hitPoint, hitPoint, tmp);

    vec3.cross(tmp, vec3.sub(tmp, worldB, worldA),
        vec3.sub(tmp1, hitPoint, worldA));
    const dot1 = vec3.dot(tmp, faceNormal);

    vec3.cross(tmp, vec3.sub(tmp, worldC, worldB),
        vec3.sub(tmp1, hitPoint, worldB));
    const dot2 = vec3.dot(tmp, faceNormal);

    vec3.cross(tmp, vec3.sub(tmp, worldA, worldC),
        vec3.sub(tmp1, hitPoint, worldC));
    const dot3 = vec3.dot(tmp, faceNormal);
    if (dot1 > 0 && dot2 > 0 && dot3 > 0) {
      // console.log(hitPoint);
      return {face: this, distance: distance};
    }
    return null;
  }
}
