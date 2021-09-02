import WebGLEvent from 'WebGL/Listeners/WebGLEvent';

export interface KeyboardListener {
  onKeyDown(event: globalThis.KeyboardEvent);
  onKeyUp(event: globalThis.KeyboardEvent);
}

/**
 * Class representing mouse events
 */
export class KeyboardEvent extends WebGLEvent<KeyboardListener> {
  /**
   *
   */
  init(): void {
    document.onkeydown = (e) => {
      this.getListeners().forEach((el) => {
        el.onKeyDown(e);
      });
      this.refresh();
    };

    document.onkeyup = (e) => {
      this.getListeners().forEach((el) => {
        el.onKeyUp(e);
      });
      this.refresh();
    };
  }
}

const WebGLKeyboardEvent = new KeyboardEvent();

export default WebGLKeyboardEvent;
