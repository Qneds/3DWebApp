import React, {useContext, useEffect, useState} from 'react';
import {MoveButton, RotateButton, ScaleButton} from 'utils/GUI/GUIUtils';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import MainView from 'WebGL/Views/MainView';
import {GizmoModes} from 'WebGL/Editor/Gizmos/GizmoManager';
import {tableRowStyle} from 'styles/jsStyles';
import ColorModeContext from 'contexts/ColorModeContext';
import {ETools, IViewToolSelector} from 'components/toolsWIndow/ToolsManager';
import {ITool, MoveTool, RotateTool, ScaleTool} from 'WebGL/Editor/Tools/Tools';
import TOOL_STORAGE from './ToolStorage';
import {Refresher} from 'contexts/RefresherContext';

/**
 * Returns tools table for main view
 * @param {IViewToolSelector} props
 * @return {JSX.Element}
 */
export function MainViewToolsSelector(props: IViewToolSelector): JSX.Element {
  const refresher = useContext(Refresher);

  /**
   * @param {ETools} t
   * @param {boolean} isInit
   * @return {ETools}
   */
  function setTool(t: ETools, isInit = false): ETools {
    let tool: ITool | null = null;
    switch (t) {
      case ETools.move: {
        tool = TOOL_STORAGE.getToolByType(MoveTool);
        break;
      }
      case ETools.rotate: {
        tool = TOOL_STORAGE.getToolByType(RotateTool);
        break;
      }
      case ETools.scale: {
        tool = TOOL_STORAGE.getToolByType(ScaleTool);
        break;
      }
    }
    props.updateSelectedTool(tool);
    console.log(tool);
    if (!isInit) setActActive(t);
    refresher?.refresh();
    return t;
  }

  const [actActive, setActActive] = useState(ETools.move);
  const colorModeCtx = useContext(ColorModeContext);

  useEffect(() =>{
    props.updateSelectedTool(TOOL_STORAGE.getToolByType(MoveTool));
  }, []);

  const view = (ViewManagerInst.returnView() as MainView);
  return (
    <tbody>
      <tr style={tableRowStyle(colorModeCtx)}>
        <td>
          <MoveButton text={'Move'} onClick={() => {
            if (actActive === ETools.move) return;
            setTool(ETools.move);
            view.setGizmoMode(GizmoModes.move);
          }}
          className='fill-parent-width'
          active={actActive === ETools.move} />
        </td>
      </tr>
      <tr style={tableRowStyle(colorModeCtx)}>
        <td>
          <RotateButton text={'Rotate'} onClick={() => {
            if (actActive === ETools.rotate) return;
            setTool(ETools.rotate);
            view.setGizmoMode(GizmoModes.rotate);
          }}
          className='fill-parent-width'
          active={actActive === ETools.rotate} />
        </td>
      </tr>
      <tr style={tableRowStyle(colorModeCtx)}>
        <td>
          <ScaleButton text={'Scale'} onClick={() => {
            if (actActive === ETools.scale) return;
            setTool(ETools.scale);
            view.setGizmoMode(GizmoModes.scale);
          }}
          className='fill-parent-width'
          active={actActive === ETools.scale} />
        </td>
      </tr>
    </tbody>
  );
}
