import {vec4} from 'gl-matrix';
import BasicShader from 'WebGL/Shaders/BasicShader';

/**
 * Material class
 */
export default class Material {
  private shader: BasicShader;
  private color: vec4;

  /**
   * Creates new material
   * @param {BasicShader} shader
   * @param {vec4} color
   */
  constructor(shader: BasicShader = new BasicShader(),
      color: vec4 =[1.0, 1.0, 1.0, 1.0]) {
    this.shader = shader;
    this.color = color;
  }

  /**
   * Get shader
   * @return {BasicShader}
   */
  public getShader(): BasicShader {
    return this.shader;
  }

  /**
   * Sets color
   * @param {vec4} color
   */
  public setColor(color: vec4): void {
    this.color = color;
  }

  /**
   * enables material
   */
  public enableMaterial(): void {
    this.shader.enableAlbedo(this.color);
  }
}
