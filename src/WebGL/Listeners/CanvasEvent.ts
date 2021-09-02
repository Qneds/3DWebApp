import WebGLEvent from 'WebGL/Listeners/WebGLEvent';

export interface CanvasListener {
  onResize(x: number, y: number, width: number, height: number, id?: string);
}

/**
 * Class representing mouse events
 */
export class CanvasEvent extends WebGLEvent<CanvasListener> {
  /**
   * Triggers resize event
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} id
   */
  triggerOnResize(x: number, y: number,
      width: number, height: number, id = ''): void {
    this.getListeners().forEach((el) => {
      el.onResize(x, y, width, height, id);
    });
    this.refresh();
  }
}

const WebGLCanvasEvent = new CanvasEvent();

export default WebGLCanvasEvent;
