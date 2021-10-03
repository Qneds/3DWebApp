import {AppMode} from 'components/modeNavBar/ModeNavBar';
import {EditViewToolsSelector} from 'components/toolsWIndow/EditViewTools';
import {MainViewToolsSelector} from 'components/toolsWIndow/MainViewTools';
import EditModeContext from 'contexts/EditModeContext';
import ModeContext from 'contexts/ModeContext';
import React, {useContext} from 'react';
import {ITool} from 'WebGL/Editor/Tools/Tools';


export enum ETools {
  move,
  rotate,
  scale,
  surfaceSubdivision,
}

export interface IViewToolSelector {
  updateSelectedTool: (tool: ITool | null) => void;
}

/**
 * ToolsManger class
 */
export class ToolsManager {
  private selectedTool: ITool | null = null;

  /**
   * Return component with buttons
   * @return {JSX.Element}
   */
  public returnToolsComponent(): JSX.Element {
    const viewModeCtx = useContext(ModeContext);
    const editViewModeCtx = useContext(EditModeContext);

    if (viewModeCtx?.appMode === AppMode.MainMode) {
      return (
        <MainViewToolsSelector
          updateSelectedTool={this.setSelectedTool.bind(this)}
        />
      );
    } else if (editViewModeCtx && viewModeCtx?.appMode === AppMode.EditMode) {
      return (
        <EditViewToolsSelector
          updateSelectedTool={this.setSelectedTool.bind(this)}
        />
      );
    } else {
      return (<></>);
    }
  }

  /**
   * gets given tool if its selected, otherwise returns null
   * @param {constructor} constructor
   * @return {T | null}
   */
  public getSelectedToolByType<T extends ITool>(
      constructor:{new (...args: never[]):T}): T | null {
    if (this.selectedTool && (this.selectedTool instanceof constructor)) {
      return this.selectedTool;
    } else return null;
  }

  /**
   * gets selected tool
   * @return {ITool | null}
   */
  public getSelectedTool(): ITool | null {
    return this.selectedTool;
  }

  /**
   * sets selected tool
   * @param {ITool | null} tool
   */
  private setSelectedTool(tool : ITool | null): void {
    this.selectedTool = tool;
  }
}

const ToolsManagerInst = new ToolsManager();
export default ToolsManagerInst;
