import WebGLEvent from 'WebGL/Listeners/WebGLEvent';

export interface RefreshListener {
  onRefresh(): void
}

/**
 * Refresh Event
 */
export class RefreshEvent extends WebGLEvent<RefreshListener> {
  /**
   * @param {number} dx
   * @param {number} dy
   * @param {number} dz
   */
  public refresh() : void {
    this.getListeners().forEach((el) => {
      el.onRefresh();
    });
  }
}

const GLOBAL_COMPONENTS_REFRESH_EVENT = new RefreshEvent();
export default GLOBAL_COMPONENTS_REFRESH_EVENT;
