import {EdgeHit, FaceHit, PointHit} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import {MeshRaycastHits} from 'WebGL/Objects/Mesh';
import {ObjectRaycastHit} from 'WebGL/Objects/Object3D';

/**
 * Returns FaceHit which is the closest of object
 * @param {MeshRaycastHits} hit
 * @return {FaceHit | null}
 */
export function getClosestFaceOfObj(hit: MeshRaycastHits): FaceHit | null {
  let closestFace: FaceHit | null = null;
  hit.facesHits.forEach((fh) => {
    if (!closestFace) {
      closestFace = fh;
    } else if (fh.distance < closestFace.distance) {
      closestFace = fh;
    }
  });
  return closestFace;
}

/**
 * Returns FaceHit which is the closest of object
 * @param {MeshRaycastHits} hit
 * @return {EdgeHit | null}
 */
export function getClosestEdgeOfObj(hit: MeshRaycastHits): EdgeHit | null {
  let closestEdge: EdgeHit | null = null;
  hit.edgesHits.forEach((eh) => {
    if (!closestEdge) {
      closestEdge = eh;
    } else if (eh.distance < closestEdge.distance) {
      closestEdge = eh;
    }
  });
  return closestEdge;
}


/**
 * Returns FaceHit which is the closest of object
 * @param {MeshRaycastHits} hit
 * @return {PointHit | null}
 */
export function getClosestPointOfObj(hit: MeshRaycastHits): PointHit | null {
  let closestPoint: PointHit | null = null;
  hit.pointsHits.forEach((ph) => {
    if (!closestPoint) {
      closestPoint = ph;
    } else if (ph.distance < closestPoint.distance) {
      closestPoint = ph;
    }
  });
  return closestPoint;
}

/**
   * @param {ObjectRaycastHit[] | null} arr
   * @return {PH}
   */
export function getClosestObj(arr: ObjectRaycastHit[] | null):
    [ObjectRaycastHit | null, FaceHit | null] {
  if (!arr) return [null, null];

  let closestObj: ObjectRaycastHit | null = null;
  let closestObjF: FaceHit | null = null;
  arr.forEach((h) => {
    if (!closestObj) {
      const closestFace = getClosestFaceOfObj(h.hits);
      if (closestFace) {
        closestObj = h;
        closestObjF = closestFace;
      }
    } else {
      const closestFace = getClosestFaceOfObj(h.hits);
      if (closestFace && closestObjF &&
          closestFace.distance < closestObjF.distance) {
        closestObj = h;
        closestObjF = closestFace;
      }
    }
  });
  return [closestObj, closestObjF];
}
