import {mat4} from 'gl-matrix';
import Camera from 'WebGL/Camera/Camera';

export interface Renderable {
  renderObj(camera: Camera, transformationMatrixFromParent: mat4): void;
}
