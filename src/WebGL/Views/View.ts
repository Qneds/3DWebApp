import WebGLMouseEvent, {MouseListener} from 'WebGL/Listeners/MouseEvent';

/**
 * Base class of each view
 */
export default abstract class View implements MouseListener {
  /**
   *
   */
  constructor() {
    WebGLMouseEvent.subscribe(this);
  }

  /**
   * @param {WheelEvent} event
   * @return {void}
   */
  onWheel(event: WheelEvent): void {
    return;
  }
  /**
   * @param {MouseEvent} event
   * @param {number} dx
   * @param {number} dy
   * @return {void}
   */
  onMouseMove(event: MouseEvent, dx: number, dy: number): void {
    return;
  }
  /**
   * @param {MouseEvent} event
   * @return {void}
   */
  onMouseDown(event: MouseEvent): void {
    return;
  }
  /**
   * @param {MouseEvent} event
   * @return {void}
   */
  onMouseUp(event: MouseEvent): void {
    return;
  }
  /**
   * @param {MouseEvent} event
   * @return {void}
   */
  onMouseClick(event: MouseEvent): void {
    return;
  }

  public abstract renderView(): void;
  public abstract returnOnScreenMenu(): JSX.Element;

  /**
   * Removes this obj from listeners list
   */
  public unsubscribe(): void {
    WebGLMouseEvent.unsubscribe(this);
  }
}
