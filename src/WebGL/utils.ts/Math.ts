import {vec3, mat4, quat} from 'gl-matrix';
import {Point} from 'WebGL/Objects/BasicMeshes/MeshUtils';

export const toRadians = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const toDegrees = (rad: number): number => {
  return rad * 180 / Math.PI;
};

export const calculateTransformationMatrix = (position: vec3, rotation: vec3,
    scale: vec3): mat4 => {
  const matrix = mat4.create();
  mat4.identity(matrix);
  mat4.translate(matrix, matrix, position);
  mat4.rotateX(matrix, matrix, rotation[0]);
  mat4.rotateY(matrix, matrix, rotation[1]);
  mat4.rotateZ(matrix, matrix, rotation[2]);
  mat4.scale(matrix, matrix, scale);
  return matrix;
};

/**
 * Creates matrix with given orientation
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {mat4}
 */
export function rotate(x: number, y: number, z: number): mat4 {
  const final = mat4.create();
  mat4.identity(final);
  const tmp = mat4.create();
  mat4.identity(tmp);

  const byX = mat4.create();

  const byY = mat4.create();

  const byZ = mat4.create();

  mat4.fromXRotation(byX, x);
  mat4.fromYRotation(byY, y);
  mat4.fromZRotation(byZ, z);
  mat4.multiply(final, tmp, byZ);
  mat4.multiply(tmp, final, byY);
  mat4.multiply(final, tmp, byX);
  return final;
}

/**
 * Returns Euler's angles from quaternion
 * @param {quat} q
 * @return {vec3}
 */
export function quatToEuler(q: quat): vec3 {
  const test = q[0]*q[1] + q[2]*q[3];
  let heading = 0;
  let attitude = 0;
  let bank = 0;

  if (test > 0.499) { // singularity at north pole
    heading = 2 * Math.atan2(q[0], q[3]);
    attitude = Math.PI/2;
    bank = 0;
  } else if (test < -0.499) { // singularity at south pole
    heading = -2 * Math.atan2(q[0], q[3]);
    attitude = - Math.PI/2;
    bank = 0;
  } else {
    const sqx = q[0]*q[0];
    const sqy = q[1]*q[1];
    const sqz = q[2]*q[2];
    heading = Math.atan2(2*q[1]*q[3]-2*q[0]*q[2], 1 - 2*sqy - 2*sqz);
    attitude = Math.asin(2*test);
    bank = Math.atan2(2*q[0]*q[3]-2*q[1]*q[2], 1 - 2*sqx - 2*sqz);
  }

  return vec3.fromValues(bank, heading, attitude);
}

/**
 * return intersection of 2 arrays
 * @param {[]} a
 * @param {[]} b
 * @return {[]}
 */
export function calculateIntersection<A>(a: A[], b: A[]): A[] {
  return a.filter((x) => b.includes(x));
}

/**
 * Normalizes angle to values <-pi, pi>
 * @param {number} angle
 * @return {number}
 */
export function normalizeAngle(angle: number): number {
  let dist = 0;
  if (angle < -Math.PI) {
    dist = Math.floor((angle + Math.PI)/2*Math.PI);
  }
  if (angle > Math.PI) {
    dist = Math.ceil((angle - Math.PI)/2*Math.PI);
  }
  angle = angle - (dist * 2 * Math.PI);
  return angle;
}

/**
 * Extract rotation matrix from transformation matrix
 * @param {mat4} mat
 * @return {mat4}
 */
export function extractOrientationMatrix(mat: mat4): mat4 {
  const ret = mat4.create();
  mat4.copy(ret, mat);

  ret[3] = ret[7] = ret[11] = ret[12] = ret[13] = ret[14] = ret[15] = 0;
  return ret;
}

/**
 * extract sign value from number
 * @param {number} sample
 * @return {number}
 */
export function getSign(sample: number): number {
  if (sample < 0) {
    return -1;
  } else if (sample > 0) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Changes sign of number to given value
 * @param {number[]} data
 * @param {number} sign
 * @return {number}
 */
export function changeSign(data: number[], sign: number): number[] {
  sign = getSign(sign);
  data.forEach((d, i) => {
    const absolute = Math.abs(d);
    data[i] = absolute * sign;
  });
  return data;
}

/**
 * checks if 3 2D points are colinear
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @return {boolean}
 */
export function collinear2D(x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number): boolean {
  const a = x1 * (y2 - y3) +
            x2 * (y3 - y1) +
            x3 * (y1 - y2);
  return a === 0;
}

/**
 * Calculates center point of given points
 * @param {Point[]} points
 * @return {Point}
 */
export function calculateCenterPoint(points: Point[]): Point {
  let x = 0;
  let y = 0;
  let z = 0;
  points.map((p) => {
    x += p.getCords()[0];
    y += p.getCords()[1];
    z += p.getCords()[2];
  });
  x = x/points.length;
  y = y/points.length;
  z = z/points.length;
  return new Point(vec3.fromValues(x, y, z));
}
