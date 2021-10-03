import Camera from 'WebGL/Camera/Camera';
import WebGLU from 'WebGL/WebGlUtils';
import BasicShader from 'WebGL/Shaders/BasicShader';
import {mat4} from 'gl-matrix';
import ShaderUniformsLocations from 'WebGL/Shaders/ShadersUniformLocations';
import {Renderable} from './Renderer';


/**
 * Standard renderer
 */
export default class StandardRenderer {
  private camera: Camera;
  private objToRender: Renderable;

  /**
   * Creates standard renderer
   * @param {Camera} camera
   * @param {Renderable} objToRender
   */
  constructor(camera: Camera, objToRender: Renderable) {
    this.camera = camera;
    this.objToRender = objToRender;
  }

  /**
   *
   */
  public renderFrame(): void {
    WebGLU.clear(0, 0, 0, 0.3);
    WebGLU.viewport();
    WebGLU.enableDepthTest(true);
    const tmp = mat4.create();
    this.objToRender.renderObj(this.camera, mat4.identity(tmp));
  }
}
