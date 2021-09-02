import {FaceHit} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import {MeshRaycastHits} from 'WebGL/Objects/Mesh';

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
