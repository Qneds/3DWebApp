import WebGLU from 'WebGL/WebGlUtils';
import StandardRenderer from 'WebGL/Renderers/StandardRenderer';
import Camera from 'WebGL/Camera/Camera';
import Object3D from './Objects/Object3D';
import CameraController from './Camera/CameraContorller';
import WebGLMouseEvent from './Listeners/MouseEvent';
import WebGLKeyboardEvent from './Listeners/KeyboardEvent';
import {CanvasEvent} from './Listeners/CanvasEvent';
import {Gizmo} from './Editor/Gizmos/Gizmo';
import {ConeBuilder} from './Objects/BasicMeshes/Cone';
import Mesh from './Objects/Mesh';
import {CircleBuilder} from './Objects/BasicMeshes/Circle';
import RayCaster, {Ray, RayCasterMode} from './Raycast/RayCaster';
import {CubeBuilder} from './Objects/BasicMeshes/Cube';
/**
 * WebGl
 */
export class WebGL {
  private gl: WebGLRenderingContext | null;
  private renderer : StandardRenderer | null;
  private mainCamera : Camera | null;
  private cameraController: CameraController | null;
  private canvasEvent: CanvasEvent | null;
  private raycaster : RayCaster | null;

  /**
   * @param  {WebGLRenderingContext} context
   */
  constructor() {
    this.gl = null;
    this.renderer = null;
    this.mainCamera = null;
    this.cameraController = null;
    this.canvasEvent = null;
    this.raycaster = null;
  }

  /**
   * initialize program
   * @param {WebGLRenderingContext} context
   * @param {CanvasEvent | null} canvasEvent
   */
  public init(context: WebGLRenderingContext,
      canvasEvent: CanvasEvent | null = null): void {
    this.gl = context;
    this.canvasEvent = canvasEvent;
    WebGLU.initUtils(this.gl);
    this.mainCamera = new Camera();
    this.mainCamera.setCanvasEvent(canvasEvent);

    const obj = new Object3D();
    obj.setMesh(new Mesh(new CircleBuilder().setRadialSegments(4).build()));
    const cObj = new Object3D();
    cObj.setMesh(new Mesh(new ConeBuilder().build()));
    // obj.addChild(cObj);
    this.renderer = new StandardRenderer(this.mainCamera,
        obj/* new Gizmo().getGizmo()*/);

    this.raycaster = new RayCaster(new Ray(), obj, RayCasterMode.point, true);
    this.raycaster.cast();

    WebGLMouseEvent.init();
    WebGLKeyboardEvent.init();
    if (this.mainCamera) {
      this.cameraController =
        new CameraController(this.mainCamera, this.raycaster);
    }
  }

  /**
   * Init render loop
   * @return {void}
   */
  intiRenderLoop(): void {
    if (!this.gl) {
      return;
    }
    window.requestAnimationFrame(this.render.bind(this));
  }

  /**
   * Rendering function
   * @return {void}
   */
  render(): void {
    // WebGLU.clear(0., 0., 0., 1.0);

    if (!this.renderer) {
      return;
    }
    this.renderer.renderFrame();

    window.requestAnimationFrame(this.render.bind(this));
  }
}

const WebGLI = new WebGL();

export default WebGLI;
