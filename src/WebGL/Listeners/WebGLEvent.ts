/**
 * Basic event
 */
export default class WebGLEvent<T> {
  private listeners: T[] = [];

  /**
   * subscibes to an event
   * @param {T} listener
   */
  public subscribe(listener: T): void {
    this.listeners.push(listener);
  }

  /**
   * unsubscribes from an event
   * @param {T} listener
   */
  public unsubscribe(listener: T): void {
    this.listeners = this.listeners.filter((l) => {
      return l !== listener;
    });
  }

  /**
   * Returns actual listeners
   * @return {T[]}
   */
  protected getListeners(): T[] {
    return this.listeners;
  }
}
