import {isNaN, re} from 'mathjs';
import GLOBAL_COMPONENTS_REFRESH_EVENT from 'utils/RefreshEvent';
import {SimpleProvider} from 'WebGL/Objects/BasicMeshes/GeometryProvider';
import {Edge, Face, Point} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import Mesh from 'WebGL/Objects/Mesh';
import Object3D from 'WebGL/Objects/Object3D';
import STATE from 'WebGL/State';
import earcut from 'earcut';
import {mat4, vec3} from 'gl-matrix';
import {collinear2D} from 'WebGL/utils.ts/Math';

/**
 * Parses text from .obj format to Object3D. Returns null if format was invalid
 * @param {string} text
 * @return {Object3D[]}
 */
export function textToObject3D(text: string): Object3D[] {
  const lines = text.split(/\r\n|\n/);
  const vertexes : Point[] = [];
  let currVertexes : Point[] = [];
  const edges : Edge[] = [];
  let currEdges : Edge[] = [];
  const faces : Face[] = [];
  let currFaces : Face[] = [];
  const processedEdgesIndices: number[][] = [];

  const objectList: Object3D[] = [];
  let currentObject: Object3D | null = null;
  let skipObject = false;
  let falseCnt = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineParts = line.split(/\s+/);

    // create new object
    if (lineParts[0] === 'o') {
      if (skipObject) {
        falseCnt++;
      } else if (currentObject) {
        currentObject.setMesh(
            new Mesh(new SimpleProvider(currVertexes, currEdges, currFaces)),
        );
        objectList.push(currentObject);
      }
      currVertexes = [];
      currEdges = [];
      currFaces = [];
      skipObject = false;
      currentObject = new Object3D();
      if (lineParts[1]) currentObject.setName(lineParts[1]);
    }

    // read vertices
    if ((lineParts.length === 4 || lineParts.length === 5) &&
        lineParts[0] === 'v' && !skipObject) {
      let normalizeCords = 1;
      if (lineParts.length === 5) normalizeCords = parseFloat(lineParts[4]);
      if (isNaN(normalizeCords) || normalizeCords === 0) {
        skipObject = true;
        break;
      }

      const normalizeX = parseFloat(lineParts[1])/normalizeCords;
      const normalizeY = parseFloat(lineParts[2])/normalizeCords;
      const normalizeZ = parseFloat(lineParts[3])/normalizeCords;
      if (isNaN(normalizeX) ||
          isNaN(normalizeY) ||
          isNaN(normalizeZ)) {
        skipObject = true;
        break;
      }
      const p = new Point([normalizeX, normalizeY, normalizeZ]);
      vertexes.push(p);
      currVertexes.push(p);
    }

    // read faces
    if (lineParts[0] === 'f' && !skipObject) {
      const faceIndices = lineParts.slice(1);
      const facePointsIndices = faceIndices.map((fi) => {
        return parseInt(fi.split('/')[0]);
      });

      let triples: number[][] = [];
      if (facePointsIndices.length === 3) {
        // triangles case
        triples = [facePointsIndices];
      } else {
        // polygon case
        const facePoints = facePointsIndices.map((fp) => vertexes[fp - 1]);
        if (facePoints.length > 3) {
          const mappedToZPlane = facePoints.map((fp) => {
            const cords = fp.getCords();
            return [cords[0], cords[1]];
          });
          const p1Z = mappedToZPlane[0];
          const p2Z = mappedToZPlane[1];
          const isLineInZPlane = mappedToZPlane.map((mp, i) => {
            if (i < 2) return true;
            return collinear2D(p1Z[0], p1Z[1], p2Z[0], p2Z[1], mp[0], mp[1]);
          }).reduce((pv, cv) => pv && cv, true);

          // handle case when polygon mapped to Z plane ia a line
          // TODO into one loop??
          let internalTriangulatedIndices: number[] = [];
          if (isLineInZPlane) {
            for (let i = 0; i < 2; i++) {
              const pointsOnPlane = facePoints.map((p) => {
                const cords = p.getCords();
                return [cords[0 + i], cords[2]];
              });
              internalTriangulatedIndices = earcut(
                  pointsOnPlane.flat(), [], 2);
              if (internalTriangulatedIndices.length > 0) break;
            }
          } else {
            internalTriangulatedIndices = earcut(
                facePoints.map((fp) => fp.getCords()).flat(), [], 3);
          }
          const externalTriangulatedIndices =
          internalTriangulatedIndices.map((iti) =>
            vertexes.indexOf(facePoints[iti]) + 1);

          const finalIndices: number[][] = [];
          while (externalTriangulatedIndices.length) {
            finalIndices.push(externalTriangulatedIndices.splice(0, 3));
          }
          triples = finalIndices;
        }
      }

      triples.forEach((triple) => {
        const faceEdges: Edge[] = [];
        for (let searchingIndex = 0;
          searchingIndex < triple.length; searchingIndex++) {
          const p1I = triple[searchingIndex];
          const p2I = triple[
              (searchingIndex + 1) % triple.length
          ];

          if (p1I < 1 || p2I < 1) return null;

          const edgeIndex = triple.find((ei) => {
            return (ei[0] === p1I && ei[1] === p2I) ||
              (ei[0] === p2I && ei[1] === p1I);
          });

          if (edgeIndex) {
            faceEdges.push(edges[edgeIndex[2]]);
          } else {
            const edge = new Edge(vertexes[p1I - 1], vertexes[p2I - 1]);
            processedEdgesIndices.push([p1I, p2I, edges.length]);
            edges.push(edge);
            currEdges.push(edge);
            faceEdges.push(edge);
          }
        }
        const f = new Face(faceEdges as [Edge, Edge, Edge]);
        faces.push(f);
        currFaces.push(f);
      });
    }
  }

  if (skipObject) {
    falseCnt++;
  } else if (currentObject) {
    currentObject.setMesh(
        new Mesh(new SimpleProvider(currVertexes, currEdges, currFaces)),
    );
    objectList.push(currentObject);
  }
  return objectList;
}

/**
 * @param {Object3D} obj
 * @param {boolean} isRecursive
 * @return {string}
 */
export function object3DToString(
    obj: Object3D, isRecursive = false,
): string {
  const vertices: Point[] = [];
  const t = mat4.create();
  mat4.identity(t);
  return parseObjWithTransform(obj, t, vertices, isRecursive);
}

/**
 * @param {Object3D} obj
 * @param {mat4} transform
 * @param {Point[] | undefined} vertexes
 * @param {boolean} isRecursive
 * @return {string}
 */
export function parseObjWithTransform(
    obj: Object3D, transform: mat4,
    vertexes: Point[] | undefined, isRecursive = false,
): string {
  let usedVertexes: Point[] = [];
  if (vertexes) usedVertexes = vertexes;

  const parsedObj = parseObject(obj, transform, usedVertexes);
  let parsedChildren: string[] = [];

  if (isRecursive) {
    parsedChildren = obj.getChildrenList().map((o) => {
      const childrenTransform = mat4.create();
      mat4.mul(childrenTransform,
          transform, o.getTransform().getTransformationMatrix());
      return parseObjWithTransform(
          o, childrenTransform, usedVertexes, isRecursive);
    });
  }
  return [parsedObj].concat(parsedChildren).join('\n');
}

/**
 * Parses Object to text in .obj format
 * @param {Object3D} obj
 * @param {mat4} transform
 * @param {Point[]} vertexes
 * @return {string}
 */
function parseObject(
    obj: Object3D, transform: mat4, vertexes: Point[]): string {
  const mesh = obj.getMesh();
  let errorOccurred = false;
  if (!mesh) return '';

  // create point format
  const objVertexes = mesh.getPoints();
  vertexes.push(...objVertexes);
  const vertexFormatArr = objVertexes.map((v) => {
    const transformedCords = vec3.create();
    vec3.transformMat4(transformedCords, v.getCords(), transform);
    return 'v ' + transformedCords.join(' ');
  });

  // create face format
  const objFaces = mesh.getFaces();
  const faceFormatArr = objFaces.map((face) => {
    if (errorOccurred) return '';
    const points = face.getPoints();

    const indices = points.map((point) =>{
      const index = vertexes.indexOf(point);
      if (index < 0) {
        errorOccurred = true;
        return 0;
      }
      return index + 1;
    });
    return 'f ' + indices.join(' ');
  });
  if (errorOccurred) return '';
  const formattedObj = [`o ${obj.getName()}`]
      .concat(vertexFormatArr, faceFormatArr);
  return formattedObj.join('\n');
}
