import {vec3, mat4, quat} from 'gl-matrix';

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

  return vec3.fromValues(heading, attitude, bank);
}

/**
 * return intersection of 2 arrays
 * @param {[]} a
 * @param {[]} b
 * @return {[]}
 */
export function intersection<A>(a: A[], b: A[]): A[] {
  return a.filter((x) => b.includes(x));
}
