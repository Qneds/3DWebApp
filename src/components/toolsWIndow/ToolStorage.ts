import {ITool, MoveTool, RotateTool, ScaleTool,
  SurfaceSubdivisionTool} from 'WebGL/Editor/Tools/Tools';

/**
 * Class representing container to store all possible tools
 */
class ToolStorageClass {
  private toolArray: ITool[] = [
    new MoveTool(),
    new RotateTool(),
    new ScaleTool(),
    new SurfaceSubdivisionTool(),
  ]


  /**
   * Get tool by type if tool exist in storage, otherwise return null
   * @param {constructor} constructor
   * @return {T | null}
   */
  public getToolByType<T extends ITool>(
      constructor:{new (...args: never[]):T}): T | null {
    const tool = this.toolArray.find(
        (t) => (t && (t instanceof constructor)));
    return tool ? tool as T : null;
  }
}

const TOOL_STORAGE = new ToolStorageClass();

export default TOOL_STORAGE;
