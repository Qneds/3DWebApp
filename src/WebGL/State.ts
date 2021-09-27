import GLOBAL_COMPONENTS_REFRESH_EVENT from 'utils/RefreshEvent';
import Camera from './Camera/Camera';
import Object3D from './Objects/Object3D';

/**
 * Class representing state of program
 */
class State {
  private world :Object3D | null = null;
  private selectedObject :Object3D | null = null;

  /**
   * Sets new world object
   * @param {Object3D | null} world
   */
  public setWorld(world: Object3D | null) {
    this.world = world;
  }

  /**
   * Returns world object
   * @return {Object3D | null}
   */
  public getWorld(): Object3D | null {
    return this.world;
  }


  /**
   * Sets new selected object
   * @param {Object3D | null} selectedObject
   */
  public setSelectedObject(selectedObject: Object3D | null) {
    this.selectedObject = selectedObject;
    GLOBAL_COMPONENTS_REFRESH_EVENT.refresh();
  }

  /**
   * Returns selected object
   * @return {Object3D | null}
   */
  public getSelectedObject(): Object3D | null {
    return this.selectedObject;
  }
}

const STATE = new State();
export default STATE;
