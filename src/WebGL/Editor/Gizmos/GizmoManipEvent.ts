import WebGLEvent from 'WebGL/Listeners/WebGLEvent';

export interface GizmoManipListener {
  onMove(dx: number, dy: number, dz: number): void;
  onRotate(dx: number, dy: number, dz: number): void;
  onScale(dx: number, dy: number, dz: number): void;
}

/**
 * Gizmo Manip Event
 */
export class GizmoManipEvent extends WebGLEvent<GizmoManipListener> {
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  public onMove(dx: number, dy: number, dz: number) : void {
    this.getListeners().forEach((el) => {
      el.onMove(dx, dy, dz);
    });
  }
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  public onRotate(dx: number, dy: number, dz: number) : void {
    this.getListeners().forEach((el) => {
      el.onRotate(dx, dy, dz);
    });
  }
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  public onScale(dx: number, dy: number, dz: number) : void {
    this.getListeners().forEach((el) => {
      el.onScale(dx, dy, dz);
    });
  }
}
