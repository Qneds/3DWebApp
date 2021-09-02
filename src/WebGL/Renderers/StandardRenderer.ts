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
   * Renders next frame
   *//*
  public renderFrame(): void {
    WebGLU.clear(0, 0, 0, 0.5);
    WebGLU.viewport();
    WebGLU.enableDepthTest(true);

    const shader = new BasicShader();
    shader.use();

    shader.enableViewProjectionMatrices(
        this.camera.getLookAtMatrix(),
        this.camera.getProjectionMatrix());

    const vb = WebGLU.createBuffer();
    if (!vb) {
      return;
    }
    WebGLU.bindArrayBuffer(vb);
    WebGLU.addArrayBufferData(vertices);
    WebGLU.unbindArrayBuffer();

    const ib = WebGLU.createBuffer();
    if (!ib) {
      return;
    }
    WebGLU.bindElementArrayBuffer(ib);
    WebGLU.addElementArrayBufferData(indices);
    WebGLU.unbindElementArrayBuffer();

    WebGLU.bindArrayBuffer(vb);

    const gl = WebGLU.returnWebGLContext();
    if (!gl) return;

    const p = shader.getProgram();
    if (!p) return;
    const positionAttribute =
      WebGLU.getAttribLocation(p,
          ShaderUniformsLocations.POSITION);
    console.log(positionAttribute);
    shader.enablePosition();
    WebGLU.bindElementArrayBuffer(ib);
    gl.drawElements(
        gl.TRIANGLES, indices.length,
        gl.UNSIGNED_INT, 0);
  }*/

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
