import {vec3, mat4} from 'gl-matrix';

export const toRadians = (deg: number): number => {
  return deg * (Math.PI/180);
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
