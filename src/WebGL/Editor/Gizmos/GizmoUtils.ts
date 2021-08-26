import {vec4} from 'gl-matrix';
import {ConeBuilder} from 'WebGL/Objects/BasicMeshes/Cone';
import {CubeBuilder} from 'WebGL/Objects/BasicMeshes/Cube';
import {CylinderBuilder} from 'WebGL/Objects/BasicMeshes/Cylinder';
import {TorusBuilder} from 'WebGL/Objects/BasicMeshes/Torus';
import Material from 'WebGL/Objects/Material';
import Mesh from 'WebGL/Objects/Mesh';
import Object3D from 'WebGL/Objects/Object3D';
import {Transform} from 'WebGL/Objects/Transform';
import BasicShader from 'WebGL/Shaders/BasicShader';

/**
 * Creates arrow for gizmo move
 * @param {number} cylinderHeight
 * @param {number} cylinderRadius
 * @param {number} coneHeight
 * @param {number} coneRadius
 * @param {number} precision
 * @param {vec4} color
 * @return {Object3D}
 */
export function buildMoveGizmoDir(cylinderHeight: number,
    cylinderRadius: number, coneHeight: number,
    coneRadius: number, precision: number, color: vec4): Object3D {
  const coneBuilder = new ConeBuilder();
  const cylinderBuilder = new CylinderBuilder();

  const cylinder = cylinderBuilder.setHeight(cylinderHeight)
      .setRadiusBottom(cylinderRadius).setRadiusTop(cylinderRadius)
      .setRadialSegments(precision).build();
  const cone = coneBuilder.setRadius(coneRadius).setHeight(coneHeight)
      .setRadialSegments(precision).build();

  const cylinderObj = new Object3D();
  const coneObj = new Object3D();

  const cylinderT = new Transform();
  cylinderObj.setMesh(new Mesh(cylinder));
  cylinderObj.setMaterial(new Material(new BasicShader(), color));
  cylinderT.setPositionInParent([0, cylinderHeight/2, 0]);
  cylinderObj.setTransform(cylinderT);

  const coneT = new Transform();
  coneObj.setMesh(new Mesh(cone));
  coneObj.setMaterial(new Material(new BasicShader(), color));
  coneT.setPositionInParent([0, cylinderHeight + coneHeight/2, 0]);
  coneObj.setTransform(coneT);

  const obj = new Object3D();
  obj.addChild(cylinderObj);
  obj.addChild(coneObj);

  return obj;
}


/**
 * Creates circle for gizmo rotate
 * @param {number} outerRadius
 * @param {number} innerRadius
 * @param {number} outerPrecision
 * @param {number} innerPrecision
 * @param {vec4} color
 * @return {Object3D}
 */
export function buildRotateGizmoDir(outerRadius: number,
    innerRadius: number, outerPrecision: number,
    innerPrecision: number, color: vec4): Object3D {
  const torusBuilder = new TorusBuilder();

  const torus = torusBuilder.setRadius(outerRadius)
      .setTube(innerRadius).setRadialSegments(innerPrecision)
      .setTubularSegments(outerPrecision).build();

  const torusObj = new Object3D();

  const torusT = new Transform();
  torusObj.setMesh(new Mesh(torus));
  torusObj.setMaterial(new Material(new BasicShader(), color));
  torusObj.setTransform(torusT);

  const obj = new Object3D();
  obj.addChild(torusObj);

  return obj;
}


/**
 * Creates handle for gizmo scale
 * @param {number} cylinderHeight
 * @param {number} cylinderRadius
 * @param {number} cubeScale
 * @param {number} precision
 * @param {vec4} color
 * @return {Object3D}
 */
export function buildScaleGizmoDir(cylinderHeight: number,
    cylinderRadius: number,
    cubeScale: number, precision: number, color: vec4): Object3D {
  const cubeBuilder = new CubeBuilder();
  const cylinderBuilder = new CylinderBuilder();

  const cubeHalfWidth = 1;
  const cylinder = cylinderBuilder.setHeight(cylinderHeight)
      .setRadiusBottom(cylinderRadius).setRadiusTop(cylinderRadius)
      .setRadialSegments(precision).build();
  const cube = cubeBuilder.setXHalfWidth(cubeHalfWidth)
      .setYHalfWidth(cubeHalfWidth).setZHalfWidth(cubeHalfWidth).build();

  const cylinderObj = new Object3D();
  const cubeObj = new Object3D();

  const cylinderT = new Transform();
  cylinderObj.setMesh(new Mesh(cylinder));
  cylinderObj.setMaterial(new Material(new BasicShader(), color));
  cylinderT.setPositionInParent([0, cylinderHeight/2, 0]);
  cylinderObj.setTransform(cylinderT);

  const cubeT = new Transform();
  cubeObj.setMesh(new Mesh(cube));
  cubeObj.setMaterial(new Material(new BasicShader(), color));
  cubeT.setPositionInParent([0, cylinderHeight + cubeScale*cubeHalfWidth, 0]);
  cubeT.setScaleInParent([cubeScale, cubeScale, cubeScale]);
  cubeObj.setTransform(cubeT);

  const obj = new Object3D();
  obj.addChild(cylinderObj);
  obj.addChild(cubeObj);

  return obj;
}
