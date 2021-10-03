import {mat4, vec3} from 'gl-matrix';
import RayCaster, {RayCastable, RayCasterMode} from 'WebGL/Raycast/RayCaster';
import BasicShader from 'WebGL/Shaders/BasicShader';
import WebGLU from 'WebGL/WebGlUtils';
import CircleInst from './BasicMeshes/Circle';
import ConeInst from './BasicMeshes/Cone';
import CubeInst from './BasicMeshes/Cube';
import CylinderInst from './BasicMeshes/Cylinder';
import {GeometryProvider, SimpleProvider} from './BasicMeshes/GeometryProvider';
import {Face, Edge, Point, PointHit, EdgeHit, FaceHit}
  from './BasicMeshes/MeshUtils';
import TorusInst from './BasicMeshes/Torus';

export type MeshRaycastHits = {
  pointsHits: PointHit[],
  edgesHits: EdgeHit[],
  facesHits: FaceHit[],
}


/**
 * Mesh class
 */
export default class Mesh {
  private enabled: boolean;
  protected faces: Face[] = [];
  protected edges: Edge[] = [];
  protected points: Point[] = [];

  private verticesBuffer : WebGLBuffer | null = null;
  private indicesBuffer : WebGLBuffer | null = null;
  private vertices: number[] = [];
  private indicesFaces: number[] = [];
  private indicesEdges: number[] = [];
  private indicesPoints: number[] = [];

  /**
   * Creates new Mesh instance
   * @param {GeometryProvider} geometryProvider
   */
  constructor(geometryProvider: GeometryProvider = CubeInst) {
    // const outVert = CubeInst.generateWebglVertexes();
    // const outVert = CylinderInst.generateWebglVertexes();
    // const outVert = TorusInst.generateWebglVertexes();
    // const outVert = ConeInst.generateWebglVertexes();
    // const outVert = CircleInst.generateWebglVertexes();
    this.enabled = true;
    this.points = geometryProvider.getPoints();
    this.edges = geometryProvider.getEdges();
    this.faces = geometryProvider.getFaces();
    this.verticesBuffer = WebGLU.createBuffer();
    this.indicesBuffer = WebGLU.createBuffer();
    this.generateWebglVertexes();
    this.loadVerticesBuffer();
    this.loadIndicesBuffer();
  }

  /**
   * Generates new vertices buffer
   * @return {void}
   */
  private loadVerticesBuffer(): void {
    if (this.verticesBuffer) {
      WebGLU.uploadDataToBuffer(this.verticesBuffer, this.vertices);
    }
  }

  /**
   * Generates new indices buffer
   * @return {void}
   */
  private loadIndicesBuffer(): void {
    if (this.indicesBuffer) {
      WebGLU.uploadElementDataToBuffer(this.indicesBuffer, this.indicesFaces);
    }
  }

  /**
   * activates this mesh
   * @param {BasicShader} shader
   */
  public useFaces(shader: BasicShader): void {
    if (this.verticesBuffer && this.indicesBuffer) {
      WebGLU.bindArrayBuffer(this.verticesBuffer);
      shader.enablePosition();
      WebGLU.bindElementArrayBuffer(this.indicesBuffer);
    }
  }

  /**
   * Return length of indices array
   * @return {number}
   */
  public getIndicesLength(): number {
    // console.log(this.indicesPoints, this.vertices);
    return this.indicesFaces ? this.indicesFaces.length : 0;
  }

  /**
   * Generate indices and vertexes from face-edge-point hierarchy
   * @return {[number[], number[]]}
   */
  private generateWebglVertexes(): [number[], number[]] {
    const vertices: Array<number[]> = [];
    let indices: Array<number> = [];
    const points: Array<Point> = [];
    const indicesDrawLine: Array<number> = [];

    this.faces.forEach((face) => {
      const pointsInEdges: Array<Point> = [];
      const indicesInEdges: Array<number> = [];

      face.getEdges().forEach((edge) => {
        const [p1, p2] = edge.getPoints();
        let findP1 = points.find((p) => p === p1);
        let findP2 = points.find((p) => p === p2);
        if (!findP1) {
          points.push(p1);
          findP1 = p1;
        }
        if (!findP2) {
          points.push(p2);
          findP2 = p2;
        }

        if (pointsInEdges.length === 0) {
          pointsInEdges.push(findP1);
          indicesInEdges.push(points.indexOf(findP1));
          pointsInEdges.push(findP2);
          indicesInEdges.push(points.indexOf(findP2));
          return;
        }

        if (findP1 === pointsInEdges[0] &&
            findP2 !== pointsInEdges[pointsInEdges.length - 1]) {
          pointsInEdges.unshift(findP2);
          indicesInEdges.unshift(points.indexOf(findP2));
        } else if (findP1 === pointsInEdges[pointsInEdges.length - 1] &&
            findP2 !== pointsInEdges[0]) {
          pointsInEdges.push(findP2);
          indicesInEdges.push(points.indexOf(findP2));
        } else if (findP2 === pointsInEdges[0] &&
            findP1 !== pointsInEdges[pointsInEdges.length - 1]) {
          pointsInEdges.unshift(findP1);
          indicesInEdges.unshift(points.indexOf(findP1));
        } else if (findP2 === pointsInEdges[pointsInEdges.length - 1] &&
            findP1 !== pointsInEdges[0]) {
          pointsInEdges.push(findP1);
          indicesInEdges.push(points.indexOf(findP1));
        }
      });
      indices = indices.concat(indicesInEdges);
    });

    this.edges.forEach((e) => {
      const [p1, p2] = e.getPoints();

      let findP1 = points.find((p) => p === p1);
      let findP2 = points.find((p) => p === p2);
      if (!findP1) {
        points.push(p1);
        findP1 = p1;
      }
      if (!findP2) {
        points.push(p2);
        findP2 = p2;
      }

      indicesDrawLine.push(points.indexOf(findP1));
      indicesDrawLine.push(points.indexOf(findP2));
    });

    points.forEach((p) => {
      const vec = p.getCords();
      vertices.push([vec[0], vec[1], vec[2]]);
    });
    const flatten = vertices.flat();

    this.vertices = flatten;
    this.indicesFaces = indices;
    this.indicesEdges = indicesDrawLine;
    this.indicesPoints = Array.from(Array(points.length).keys());
    return [flatten, indices];
  }

  /**
   * Copies this mesh as a new obj
   * @return {Mesh}
   */
  public copy(): Mesh {
    const newPoints: Point[] = [];
    const newEdges: Edge[] = [];
    const newFaces: Face[] = [];

    this.points.forEach((p) => {
      const po = vec3.create();
      vec3.copy(po, p.getCords());
      newPoints.push(new Point(po));
    });

    this.edges.forEach((e) => {
      const p1 = this.points.find((p) =>
        p === e.getPoints[0],
      );
      const p2 = newPoints.find((p) =>
        p === e.getPoints[1],
      );

      if (p1 && p2) {
        const i1 = this.points.indexOf(p1);
        const i2 = this.points.indexOf(p2);
        if (i1 >= 0 && i2 >= 0) {
          newEdges.push(new Edge(newPoints[i1], newPoints[i2]));
        }
      }
    });

    this.faces.forEach((f) => {
      const edgesIndexes: number[] = [];
      f.getEdges().forEach((e) => {
        const oldEdge = this.edges.find((oe) => oe === e);
        if (oldEdge) {
          const oldIndex = this.edges.indexOf(oldEdge);
          if (oldIndex >= 0) {
            edgesIndexes.push(oldIndex);
          }
        }
      });
      const newEdgesInFace = edgesIndexes.map((i) => {
        return newEdges[i];
      });
      newFaces.push(new Face([newEdgesInFace[0], newEdgesInFace[1],
        newEdgesInFace[2]]));
    });
    return new Mesh(new SimpleProvider(newPoints, newEdges, newFaces));
  }

  /**
   * @param {RayCaster} raycaster
   * @param {mat4} transformMatrix
   * @return {MeshRaycastHits}
   */
  raycastMesh(raycaster: RayCaster, transformMatrix: mat4): MeshRaycastHits {
    const pointsHits: (PointHit | null)[] = [];
    const edgesHits: (EdgeHit | null)[] = [];
    const facesHits: (FaceHit | null)[] = [];
    if (this.enabled) {
      if (raycaster.getMode() & RayCasterMode.face) {
        this.faces.forEach((f) => {
          facesHits.push(f.raycastFace(raycaster, transformMatrix));
        });
      }
      if (raycaster.getMode() & RayCasterMode.edge) {
        this.edges.forEach((e) => {
          edgesHits.push(e.raycastEdge(raycaster, transformMatrix));
        });
      }
      if (raycaster.getMode() & RayCasterMode.point) {
        this.points.forEach((p) => {
          pointsHits.push(p.raycastPoint(raycaster, transformMatrix));
        });
      }
    }

    return {
      pointsHits: pointsHits.filter((p): p is PointHit => p !== null),
      edgesHits: edgesHits.filter((e): e is EdgeHit => e !== null),
      facesHits: facesHits.filter((f): f is FaceHit => f !== null),
    };
  }

  /**
   * draws all points of mesh
   * @param {BasicShader} shader
   */
  public drawPoints(shader: BasicShader): void {
    if (!this.enabled) return;

    if (this.verticesBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.verticesBuffer);
      shader.enablePosition();
      WebGLU.drawArraysPoint(this.points.length);
    }
  }

  /**
   * Draw edges of this mesh
   * @param {BasicShader} shader
   */
  public drawEdges(shader: BasicShader): void {
    if (!this.enabled) return;

    if (this.verticesBuffer && this.indicesBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.verticesBuffer);
      shader.enablePosition();
      WebGLU.uploadElementDataToBuffer(this.indicesBuffer, this.indicesEdges);
      WebGLU.bindElementArrayBuffer(this.indicesBuffer);
      WebGLU.drawElementsEdge(this.indicesEdges.length);
    }
  }

  /**
   * Draws faces of this mesh
   * @param {BasicShader} shader
   */
  public drawFaces(shader: BasicShader): void {
    if (!this.enabled) return;

    if (this.verticesBuffer && this.indicesBuffer) {
      shader.use();
      WebGLU.bindArrayBuffer(this.verticesBuffer);
      shader.enablePosition();
      WebGLU.uploadElementDataToBuffer(this.indicesBuffer, this.indicesFaces);
      WebGLU.bindElementArrayBuffer(this.indicesBuffer);
      WebGLU.drawElementsTriangle(this.indicesFaces.length);
    }
  }

  /**
   * Refreshes buffers of mesh
   */
  public refreshBuffers(): void {
    this.generateWebglVertexes();
    this.loadVerticesBuffer();
  }

  /**
   * Returns all mesh's points
   * @return {Point[]}
   */
  public getPoints(): Point[] {
    return this.points;
  }

  /**
   * Returns all mesh's edges
   * @return {Point[]}
   */
  public getEdges(): Edge[] {
    return this.edges;
  }

  /**
   * Returns all mesh's faces
   * @return {Point[]}
   */
  public getFaces(): Face[] {
    return this.faces;
  }

  /**
   * Enables mesh
   */
  public enable(): void {
    this.enabled = true;
  }

  /**
   * Disables mesh
   */
  public disable(): void {
    this.enabled = true;
  }

  /**
   * Enables or disables mesh based on parameter
   * @param {boolean} newState
   */
  public enableDisable(newState: boolean): void {
    this.enabled = newState;
  }

  /**
   * Check if mesh is enabled
   * @return {boolean}
   */
  public isEnabled(): boolean {
    return this.enabled;
  }
}
