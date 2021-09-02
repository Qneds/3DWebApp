import WebGLU from 'WebGL/WebGlUtils';
import {mat4, vec4} from 'gl-matrix';
import ShaderUniformsLocations from './ShadersUniformLocations';

export const basicVertexShader = `
  precision mediump float;
  attribute vec3 ${ShaderUniformsLocations.POSITION};

  varying vec3 surfaceNormal;
  varying vec3 lightVector;

  uniform mat4 ${ShaderUniformsLocations.TRANSFORMATION_MATRIX};
  uniform mat4 ${ShaderUniformsLocations.VIEW_MATRIX};
  uniform mat4 ${ShaderUniformsLocations.PROJECTION_MATRIX};
  uniform vec3 ${ShaderUniformsLocations.LIGHT_POSITION};

  vec4 getWorldPosition() {
    return ${ShaderUniformsLocations.PROJECTION_MATRIX} *
      ${ShaderUniformsLocations.VIEW_MATRIX} *
      ${ShaderUniformsLocations.TRANSFORMATION_MATRIX} *
      vec4(${ShaderUniformsLocations.POSITION}, 1.0);
  }

  void main(void) {
    gl_Position = getWorldPosition();
    gl_PointSize = 5.0;
  }

`;

export const basicFragmentShader = `
  precision mediump float;

  varying vec3 surfaceNormal;
  varying vec3 lightVector;

  uniform float ${ShaderUniformsLocations.LIGHT_AMBIENT};
  uniform vec3 ${ShaderUniformsLocations.LIGHT_COLOR};

  uniform vec4 ${ShaderUniformsLocations.ALBEDO};

  float normalizedDot() {
    vec3 unitNormal = normalize(surfaceNormal);
    vec3 unitLightVector = normalize(lightVector);
    return dot(unitNormal, unitLightVector);
  }

  vec4 getDiffuseTexture(){
    return ${ShaderUniformsLocations.ALBEDO};
    // return vec4(1.0, 1.0, 1.0, 1.0);
  }

  vec4 diffuseLighting(){
    float brightness = max(normalizedDot(), 
      ${ShaderUniformsLocations.LIGHT_AMBIENT});
    return vec4(${ShaderUniformsLocations.LIGHT_COLOR}.rgb * brightness, 1.0);
  }

  void main(void) {
    gl_FragColor = getDiffuseTexture();
  }

`;

/**
 * BasicShader
 */
export default class BasicShader {
  private program: WebGLProgram | null = null;
  private positionAttribute = -1;
  private transformationMatrixUniform!: WebGLUniformLocation | null;
  private viewMatrixUniform!: WebGLUniformLocation | null;
  private projectionMatrixUniform!: WebGLUniformLocation | null;
  private albedoUniform!: WebGLUniformLocation | null;
  private lightPositionUniform!: WebGLUniformLocation | null;
  private lightAmbientUniform!: WebGLUniformLocation | null;
  private lightColorUniform!: WebGLUniformLocation | null;

  /**
   * BasicShader constructor
   */
  constructor() {
    const vertexShader = WebGLU.createVertexShader();
    if (!vertexShader) {
      return;
    }
    WebGLU.addShaderSource(vertexShader, basicVertexShader);
    WebGLU.compileShader(vertexShader);
    this.compileStatus(vertexShader);

    const fragmentShader = WebGLU.createFragmentShader();
    if (!fragmentShader) {
      return;
    }
    WebGLU.addShaderSource(fragmentShader, basicFragmentShader);
    WebGLU.compileShader(fragmentShader);
    this.compileStatus(fragmentShader);

    const program = WebGLU.createShaderProgram();
    if (!program) {
      return;
    }
    WebGLU.attachShaderToProgram(program, vertexShader);
    WebGLU.attachShaderToProgram(program, fragmentShader);
    WebGLU.linkProgram(program);
    this.program = program;

    this.positionAttribute =
      WebGLU.getAttribLocation(program, ShaderUniformsLocations.POSITION);

    this.transformationMatrixUniform =
      WebGLU.getUniformLocation(program,
          ShaderUniformsLocations.TRANSFORMATION_MATRIX);
    this.viewMatrixUniform =
      WebGLU.getUniformLocation(program, ShaderUniformsLocations.VIEW_MATRIX);
    this.projectionMatrixUniform =
      WebGLU.getUniformLocation(program,
          ShaderUniformsLocations.PROJECTION_MATRIX);
    this.lightPositionUniform =
      WebGLU.getUniformLocation(program,
          ShaderUniformsLocations.LIGHT_POSITION);
    this.lightColorUniform =
      WebGLU.getUniformLocation(program, ShaderUniformsLocations.LIGHT_COLOR);
    this.lightAmbientUniform =
      WebGLU.getUniformLocation(program, ShaderUniformsLocations.LIGHT_AMBIENT);

    this.albedoUniform =
      WebGLU.getUniformLocation(program, ShaderUniformsLocations.ALBEDO);
  }
  /**
   * Use this shader
   * @return {void}
   */
  use(): void {
    if (!this.program) {
      return;
    }
    WebGLU.useProgram(this.program);
  }

  /**
   * Prints shader compilation status
   * @param {WebGLShader} shader
   * @return {void}
   */
  compileStatus(shader: WebGLShader): void {
    const gl = WebGLU.returnWebGLContext();
    if (!gl) {
      return;
    }

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
  }

  /**
   * @return {void}
   */
  enablePosition(): void {
    WebGLU.enableVertexAttribArray(this.positionAttribute);
    WebGLU.pointToAttribute(this.positionAttribute, 3);
  }

  /**
   * enables given transformation matrix
   * @param {mat4} matrix
   */
  enableTransformationMatrix(matrix: mat4): void {
    WebGLU.uploadMatrix4fv(this.transformationMatrixUniform, matrix);
  }

  /**
   * enable given projection matrix and view view matrix
   * for this shader
   * @param {mat4} view
   * @param {mat4} projection
   */
  enableViewProjectionMatrices(view: mat4, projection: mat4): void {
    WebGLU.uploadMatrix4fv(this.viewMatrixUniform, view);
    WebGLU.uploadMatrix4fv(this.projectionMatrixUniform, projection);
  }

  /**
   * Enables albedo
   * @param {vec4} color
   */
  enableAlbedo(color: vec4): void {
    WebGLU.uploadVec4f(this.albedoUniform, color);
  }

  /**
   *
   * @return {WebGLProgram | null}
   */
  getProgram(): WebGLProgram | null {
    return this.program;
  }
}
/*
export const basicVertexShader = `
  precision mediump float;
  attribute vec3 ${ShaderUniformsLocations.POSITION};

  varying vec3 surfaceNormal;
  varying vec3 lightVector;

  uniform mat4 ${ShaderUniformsLocations.TRANSFORMATION_MATRIX};
  uniform mat4 ${ShaderUniformsLocations.VIEW_MATRIX};
  uniform mat4 ${ShaderUniformsLocations.PROJECTION_MATRIX};
  uniform vec3 ${ShaderUniformsLocations.LIGHT_POSITION};

  vec4 getWorldPosition() {
    return ${ShaderUniformsLocations.PROJECTION_MATRIX} *
      ${ShaderUniformsLocations.VIEW_MATRIX} *
      ${ShaderUniformsLocations.TRANSFORMATION_MATRIX} *
      vec4(${ShaderUniformsLocations.POSITION}, 1.0);
  }
  vec3 getSurfaceNormal() {
    return (${ShaderUniformsLocations.PROJECTION_MATRIX} *
      ${ShaderUniformsLocations.VIEW_MATRIX} *
      ${ShaderUniformsLocations.TRANSFORMATION_MATRIX} *
      vec4(${ShaderUniformsLocations.NORMAL}, 0.0)).xyz;
  }


  void main(void) {
    surfaceNormal = getSurfaceNormal();
    lightVector = ${ShaderUniformsLocations.LIGHT_POSITION} - worldPos.xyz;
    gl_Position = getWorldPosition();
  }

`;

export const basicFragmentShader = `
  precision mediump float;
  uniform float ${ShaderUniformsLocations.LIGHT_AMBIENT};
  uniform vec3 ${ShaderUniformsLocations.LIGHT_COLOR};

  float normalizedDot() {
    vec3 unitNormal = normalize(surfaceNormal);
    vec3 unitLightVector = normalize(lightVector);
    return dot(unitNormal, unitLightVector);
  }

  vec4 getDiffuseTexture(){
    return vec4(0.4, 0.4, 0.4, 1.0);
  }

  vec4 diffuseLighting(){
    float brightness = max(normalizedDotnDot(),
      ${ShaderUniformsLocations.LIGHT_AMBIENT});
    return vec4(${ShaderUniformsLocations.LIGHT_COLOR}.rgb * brightness, 1.0);
  }

  void main(void) {
    gl_FragColor = getDiffuseTexture() * diffuseLighting();
  }

`;*/
