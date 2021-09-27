import {mat4} from 'gl-matrix';
import Camera from 'WebGL/Camera/Camera';
import {Point, Edge, Face} from 'WebGL/Objects/BasicMeshes/MeshUtils';
import {SPECIAL_MATERIALS} from 'WebGL/Objects/Material';
import Object3D from 'WebGL/Objects/Object3D';
import {setUpShader} from 'WebGL/Shaders/ShaderUtils';
import WebGLU from 'WebGL/WebGlUtils';


/**
 * Edit renderer used in edit mode
 */
export default class EditRenderer {
  private camera: Camera;
  private objToRender: Object3D;

  private selectedPoint: Point | null = null;
  private selectedEdge: Edge | null = null;
  private selectedFace: Face | null = null;

  /**
   * Creates standard renderer
   * @param {Camera} camera
   * @param {Object3D} objToRender
   */
  constructor(camera: Camera, objToRender: Object3D) {
    this.camera = camera;
    this.objToRender = objToRender;
  }

  /**
   * selects given point in renderer
   * @param {Point} p
   */
  public selectPoint(p: Point): void {
    this.selectedPoint = p;
  }
  /**
   * None point is selected in renderer
   */
  public unselectPoint(): void {
    this.selectedPoint = null;
  }

  /**
   * selects given edge in renderer
   * @param {Edge} e
   */
  public selectEdge(e: Edge): void {
    this.selectedEdge = e;
  }
  /**
   * None edge is selected in renderer
   */
  public unselectEdge(): void {
    this.selectedEdge = null;
  }

  /**
   * selects given face in renderer
   * @param {Face} f
   */
  public selectFace(f: Face): void {
    this.selectedFace = f;
  }
  /**
   * None face is selected in renderer
   */
  public unselectFace(): void {
    this.selectedFace = null;
  }

  /**
   * Renders new frame for edit mode
   */
  public renderFrame(): void {
    WebGLU.clear(0, 0, 0, 0.3);
    WebGLU.viewport();
    WebGLU.enableDepthTest(true);
    this.renderObject();
  }

  /**
   * Setups object to render
   */
  private renderObject(): void {
    const transform = mat4.create();
    /* mat4.copy(transform,
        this.objToRender.getTransform().getTransformationMatrix());*/
    mat4.identity(transform);
    const mesh = this.objToRender.getMesh();
    if (mesh) {
      if (this.selectedPoint) {
        const materialP = SPECIAL_MATERIALS.getSelectedPointMaterial();
        if (materialP) {
          const shaderP = materialP.getPointMaterial().getShader();
          setUpShader(shaderP, this.camera, transform);
          materialP.getPointMaterial().enableMaterial();
          this.selectedPoint.drawPoint(shaderP);
        }
      }

      if (this.selectedEdge) {
        const materialE = SPECIAL_MATERIALS.getSelectedEdgeMaterial();
        if (materialE) {
          const shaderE = materialE.getEdgeMaterial().getShader();
          setUpShader(shaderE, this.camera, transform);
          materialE.getEdgeMaterial().enableMaterial();
          this.selectedEdge.drawEdge(shaderE);
        }
      }

      if (this.selectedFace) {
        const materialF = SPECIAL_MATERIALS.getSelectedFaceMaterial();
        if (materialF) {
          const shaderF = materialF.getFaceMaterial().getShader();
          setUpShader(shaderF, this.camera, transform);
          materialF.getFaceMaterial().enableMaterial();
          this.selectedFace.drawFace(shaderF);
        }
      }


      const material = this.objToRender.getMaterial();
      const shaderF = material.getFaceMaterial().getShader();
      setUpShader(shaderF, this.camera, transform);
      material.getFaceMaterial().enableMaterial();
      mesh.drawFaces(shaderF);

      const shaderE = material.getEdgeMaterial().getShader();
      setUpShader(shaderE, this.camera, transform);
      material.getEdgeMaterial().enableMaterial();
      mesh.drawEdges(shaderE);

      const shaderP = material.getPointMaterial().getShader();
      setUpShader(shaderP, this.camera, transform);
      material.getPointMaterial().enableMaterial();
      mesh.drawPoints(shaderP);
    }
  }
}
