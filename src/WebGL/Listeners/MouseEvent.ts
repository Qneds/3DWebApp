import WebGLU from 'WebGL/WebGlUtils';
import WebGLEvent from 'WebGL/Listeners/WebGLEvent';

export interface MouseListener {
  onWheel(event: WheelEvent): void;
  onMouseMove(event: globalThis.MouseEvent, dx: number, dy: number): void;
  onMouseDown(event: globalThis.MouseEvent): void;
  onMouseUp(event: globalThis.MouseEvent): void;
  onMouseClick(event: globalThis.MouseEvent): void;
}

/**
 * Class representing mouse events
 */
export class MouseEvent extends WebGLEvent<MouseListener> {
  private x = 0;
  private y = 0;
  private isPressed = false;

  /**
   *
   */
  init(): void {
    const gl: WebGLRenderingContext | null = WebGLU.returnWebGLContext();
    if (!gl) {
      return;
    }

    const canvas = gl.canvas as HTMLCanvasElement;


    canvas.onwheel = (e) => {
      this.getListeners().forEach((el) => {
        el.onWheel(e);
      });
      this.refresh();
    };

    canvas.onmousemove = (e) => {
      const dx = this.x - e.clientX;
      const dy = this.y - e.clientY;
      this.x = e.clientX;
      this.y = e.clientY;
      this.getListeners().forEach((el) => {
        el.onMouseMove(e, dx, dy);
      });
      this.refresh();
    };

    canvas.onmousedown = (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.isPressed = true;
      this.getListeners().forEach((el) => {
        el.onMouseDown(e);
      });
      this.refresh();
    };

    canvas.onmouseup = (e) => {
      this.isPressed = false;
      this.getListeners().forEach((el) => {
        el.onMouseUp(e);
      });
      this.refresh();
    };

    canvas.onclick = (e) => {
      this.getListeners().forEach((el) => {
        el.onMouseClick(e);
      });
      this.refresh();
    };
  }
}

const WebGLMouseEvent = new MouseEvent();

export default WebGLMouseEvent;
