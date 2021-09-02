import {mat4} from 'gl-matrix';
import Camera from 'WebGL/Camera/Camera';
import BasicShader from './BasicShader';

/**
   * enables shader and load matrices
   * @param {BasicShader} shader
   * @param {Camera} camera
   * @param {mat4} t
   */
export function setUpShader(shader: BasicShader, camera: Camera, t: mat4):
  void {
  shader.use();
  shader.enableViewProjectionMatrices(
      camera.getLookAtMatrix(),
      camera.getProjectionMatrix());
  shader.enableTransformationMatrix(t);
}
