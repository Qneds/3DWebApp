import {vec3, mat4, vec4} from 'gl-matrix';
/**
 * WebGlUtils
 */
export class WebGLUtils {
  private gl: WebGLRenderingContext | null = null;

  /**
 * init
 * @param {WebGLRenderingContext} gl
 */
  initUtils(gl: WebGLRenderingContext ): void {
    this.gl = gl;
  }

  /**
   * Returns webgl context passed during initialization.
   * @return {WebGLRenderingContext | null}
   */
  returnWebGLContext() : WebGLRenderingContext | null {
    return this.gl;
  }

  /**
   * Clear screen with given color
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  clear(r: number, g: number, b: number, a: number): void {
    if (!this.gl) {
      return;
    }
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Creates new Buffer
   * @return {WebGLBuffer | null}
   */
  createBuffer(): WebGLBuffer | null {
    if (!this.gl) {
      return null;
    }
    return this.gl.createBuffer();
  }

  // float buffers

  /**
  *
  * @param {WebGLBuffer} buffer
  */
  bindArrayBuffer(buffer: WebGLBuffer): void {
    if (!this.gl) {
      return;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  }

  /**
   *  Unbinds arrayBuffer
   */
  unbindArrayBuffer(): void {
    if (!this.gl) {
      return;
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  /**
   * Assigns new Data to binded buffer
   * @param {Iterable<number>} data
   */
  addArrayBufferData(data: Iterable<number>): void {
    if (!this.gl) {
      return;
    }
    this.gl.bufferData(this.gl.ARRAY_BUFFER,
        new Float32Array(data), this.gl.STATIC_DRAW);
  }

  // int buffers

  /**
   * Binds buffer with integer data
   * @param {WebGLBuffer} buffer
   */
  bindElementArrayBuffer(buffer : WebGLBuffer): void {
    if (!this.gl) {
      return;
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
  }

  /**
   * Unbinds buffer with integer data
   */
  unbindElementArrayBuffer(): void {
    if (!this.gl) {
      return;
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  /**
   * Assigns new Data to binded buffer
   * @param {Iterable<number>} data
   */
  addElementArrayBufferData(data: Iterable<number>): void {
    if (!this.gl) {
      return;
    }
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(data), this.gl.STATIC_DRAW);
  }

  /**
   * Creates and return new vertex shader
   * @return {WebGLShader | null} newShader
   */
  createVertexShader(): WebGLShader | null {
    if (!this.gl) {
      return null;
    }
    return this.gl.createShader(this.gl.VERTEX_SHADER);
  }

  /**
   * Creates and return new fragment shader
   * @return {WebGLShader | null} newShader
   */
  createFragmentShader(): WebGLShader | null {
    if (!this.gl) {
      return null;
    }
    return this.gl.createShader(this.gl.FRAGMENT_SHADER);
  }

  /**
   * Adds new source program to given shader
   * @param {WebGLShader} shader shader
   * @param {string} source source program
   */
  addShaderSource(shader: WebGLShader, source: string): void {
    if (!this.gl) {
      return;
    }
    this.gl.shaderSource(shader, source);
  }

  /**
   * Compiles given shader
   * @param  {WebGLShader} shader
   * @return {void}
   */
  compileShader(shader: WebGLShader): void {
    if (!this.gl) {
      return;
    }
    this.gl.compileShader(shader);
  }

  /**
   * Creates new Shader Program
   * @return {WebGLProgram}
   */
  createShaderProgram(): WebGLProgram | null {
    if (!this.gl) {
      return null;
    }
    return this.gl.createProgram();
  }

  /**
   * Attachs shader to program
   * @param  {WebGLProgram} program
   * @param  {WebGLShader} shader
   * @return {void}
   */
  attachShaderToProgram(program: WebGLProgram, shader: WebGLShader): void {
    if (!this.gl) {
      return;
    }
    this.gl.attachShader(program, shader);
  }

  /**
   * Links Program to webgl context
   * @param  {WebGLProgram} program
   * @return {void}
   */
  linkProgram(program: WebGLProgram): void {
    if (!this.gl) {
      return;
    }
    this.gl.linkProgram(program);
  }

  /**
   * Executes program
   * @param  {WebGLProgram} program
   * @return {void}
   */
  useProgram(program: WebGLProgram): void {
    if (!this.gl) {
      return;
    }
    this.gl.useProgram(program);
  }

  /**
   * Gets number of given program
   * @param  {WebGLProgram} program
   * @param  {string} attribute
   * @return {number}
   */
  getAttribLocation(program: WebGLProgram, attribute: string): number {
    if (!this.gl) {
      return -1;
    }
    return this.gl.getAttribLocation(program, attribute);
  }

  /**
   * enables give vertex array
   * returns true if succeced, otherwise returns false
   * @param  {number} attribute
   * @return {boolean}
   */
  enableVertexAttribArray(attribute: number): boolean {
    if (!this.gl) {
      return false;
    }
    this.gl.enableVertexAttribArray(attribute);
    return true;
  }

  /**
   * @param  {number} data
   * @param  {number} dimensions
   * @return {void}
   */
  pointToAttribute(data: number, dimensions: number): void {
    if (!this.gl) {
      return;
    }
    this.gl.vertexAttribPointer(data, dimensions, this.gl.FLOAT, false, 0, 0);
  }

  /**
   * Upload vector3 to uniform with given location
   * @param {WebGLUniformLocation | null} location
   * @param {vec3} vec3
   */
  uploadVec3f(location: WebGLUniformLocation | null, vec3: vec3): void {
    if (!this.gl) {
      return;
    }
    this.gl.uniform3fv(location, vec3);
  }

  /**
   * Upload vector4 to uniform with given location
   * @param {WebGLUniformLocation | null} location
   * @param {vec4} vec4
   */
  uploadVec4f(location: WebGLUniformLocation | null, vec4: vec4): void {
    if (!this.gl) {
      return;
    }
    this.gl.uniform4fv(location, vec4);
  }

  /**
   * Upload float value to uniform with given location
   * @param {WebGLUniformLocation | null} location
   * @param {number} value
   */
  uploadFloat(location: WebGLUniformLocation | null, value: number): void {
    if (!this.gl) {
      return;
    }
    this.gl.uniform1f(location, value);
  }

  /**
   * Upload integer value to uniform with given location
   * @param {WebGLUniformLocation | null} location
   * @param {number} value
   */
  uploadInt(location: WebGLUniformLocation | null, value: number): void {
    if (!this.gl) {
      return;
    }
    this.gl.uniform1i(location, value);
  }

  /**
   * Upload boolean value to uniform with given location
   * @param {WebGLUniformLocation | null} location
   * @param {boolean} value
   */
  uploadBool(location: WebGLUniformLocation | null, value: boolean): void {
    if (!this.gl) {
      return;
    }
    this.gl.uniform1i(location, value ? 1: 0);
  }

  /**
   * Upload 4x4 matrix od float values to uniform with given location
   * @param {WebGLUniformLocation | null} location
   * @param {mat4} matrix
   */
  uploadMatrix4fv(location: WebGLUniformLocation | null, matrix: mat4): void {
    if (!this.gl) {
      return;
    }
    this.gl.uniformMatrix4fv(location, false, matrix);
  }

  /**
   * Returns uniform of given progrma under given location
   * @param {WebGLProgram} program
   * @param {string} uniform
   * @return {WebGLUniformLocation | null}
   */
  getUniformLocation(program: WebGLProgram, uniform: string):
      WebGLUniformLocation | null {
    if (!this.gl) {
      return null;
    }
    return this.gl.getUniformLocation(program, uniform);
  }

  /**
   * Setups viewport
   */
  viewport(): void {
    if (!this.gl) {
      return;
    }
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  /**
   * Enable or disable depth test
   * @param {boolean} switchDepth
   */
  enableDepthTest(switchDepth: boolean): void {
    if (!this.gl) {
      return;
    }
    switchDepth ? this.gl.enable(this.gl.DEPTH_TEST) :
      this.gl.disable(this.gl.DEPTH_TEST);
  }

  /**
   * Uploads data to specified buffer
   * @param {WebGLBuffer} buffer
   * @param {number[]} data
   */
  public uploadDataToBuffer(buffer: WebGLBuffer, data: number[]): void {
    this.bindArrayBuffer(buffer);
    this.addArrayBufferData(data);
    this.unbindArrayBuffer();
  }

  /**
   * Uploads element data to specified buffer
   * @param {WebGLBuffer} buffer
   * @param {number[]} data
   */
  public uploadElementDataToBuffer(
      buffer: WebGLBuffer, data: number[]): void {
    this.bindElementArrayBuffer(buffer);
    this.addElementArrayBufferData(data);
    this.unbindElementArrayBuffer();
  }
}

const WebGLU = new WebGLUtils();
export default WebGLU;
