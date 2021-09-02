import WebGLU from 'WebGL/WebGlUtils';
import StandardRenderer from 'WebGL/Renderers/StandardRenderer';
import Camera from 'WebGL/Camera/Camera';
import Object3D from './Objects/Object3D';
import CameraController from './Camera/CameraController';
import WebGLMouseEvent from './Listeners/MouseEvent';
import WebGLKeyboardEvent from './Listeners/KeyboardEvent';
import {CanvasEvent} from './Listeners/CanvasEvent';
import {Gizmo} from './Editor/Gizmos/Gizmo';
import {ConeBuilder} from './Objects/BasicMeshes/Cone';
import Mesh from './Objects/Mesh';
import {CircleBuilder} from './Objects/BasicMeshes/Circle';
import RayCaster, {Ray, RayCasterMode} from './Raycast/RayCaster';
import {CubeBuilder} from './Objects/BasicMeshes/Cube';
import ViewManagerInst, {ViewManager} from './Views/ViewManager';
import STATE from './State';
import {SPECIAL_MATERIALS} from './Objects/Material';
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
  private viewManager : ViewManager;
  private world: Object3D;
  private canvas: HTMLCanvasElement | null;

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
    this.canvas = null;
    this.viewManager = ViewManagerInst;
    this.world = new Object3D();
  }

  /**
   * initialize program
   * @param {WebGLRenderingContext} context
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasEvent | null} canvasEvent
   */
  public init(context: WebGLRenderingContext, canvas: HTMLCanvasElement,
      canvasEvent: CanvasEvent | null = null): void {
    this.gl = context;
    this.canvas = canvas;
    this.canvasEvent = canvasEvent;
    WebGLU.initUtils(this.gl, canvas);


    const obj = new Object3D();
    obj.setMesh(new Mesh(new CircleBuilder().setRadialSegments(4).build()));
    const cObj = new Object3D();
    cObj.setMesh(new Mesh(new ConeBuilder().build()));
    // obj.addChild(cObj);
    this.world.addChild(obj);
    // this.renderer = new StandardRenderer(this.mainCamera,
    //    this.world/* new Gizmo().getGizmo()*/);
    STATE.setWorld(this.world);
    WebGLMouseEvent.init();
    WebGLKeyboardEvent.init();
    if (!this.canvasEvent) {
      console.error('Canvas Event not initialized. Application shutdown.');
      return;
    }
    SPECIAL_MATERIALS.init();
    ViewManagerInst.init(canvasEvent as CanvasEvent);
  }

  /**
  * @param {WebGLRenderingContext} context
  */
  public updateContext(context: WebGLRenderingContext) {
    this.gl = context;
    WebGLU.initUtils(this.gl, this.canvas as HTMLCanvasElement);
    WebGLMouseEvent.init();
    WebGLKeyboardEvent.init();
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


    ViewManagerInst.renderViewWorld();

    window.requestAnimationFrame(this.render.bind(this));
  }
}

const WebGLI = new WebGL();

export default WebGLI;
