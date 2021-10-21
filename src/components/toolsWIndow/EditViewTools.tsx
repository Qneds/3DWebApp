import React, {useContext, useEffect, useState} from 'react';
import {MoveButton, RotateButton, ScaleButton,
  SubdivideButton} from 'utils/GUI/GUIUtils';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import MainView from 'WebGL/Views/MainView';
import {GizmoModes} from 'WebGL/Editor/Gizmos/GizmoManager';
import {ETools, IViewToolSelector} from 'components/toolsWIndow/ToolsManager';
import EditView, {EditViewMode} from 'WebGL/Views/EditView';
import {tableRowStyle} from 'styles/jsStyles';
import ColorModeContext from 'contexts/ColorModeContext';
import EditModeContext from 'contexts/EditModeContext';
import {ITool, MoveTool, RotateTool, ScaleTool,
  SurfaceSubdivisionTool} from 'WebGL/Editor/Tools/Tools';
import TOOL_STORAGE from './ToolStorage';
import {Refresher} from 'contexts/RefresherContext';

/**
 * Returns tools table for edit view
 * @param {IViewToolSelector} props
 * @return {JSX.Element}
 */
export function EditViewToolsSelector(props: IViewToolSelector): JSX.Element {
  const editViewModeCtx = useContext(EditModeContext);
  const [actActive, setActActive] = useState(ETools.move);
  const colorModeCtx = useContext(ColorModeContext);
  const refresher = useContext(Refresher);

  useEffect(() => {
    setActActive(ETools.move);
    props.updateSelectedTool(TOOL_STORAGE.getToolByType(MoveTool));
  }, [editViewModeCtx]);

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
      case ETools.surfaceSubdivision: {
        tool = TOOL_STORAGE.getToolByType(SurfaceSubdivisionTool);
        break;
      }
    }
    props.updateSelectedTool(tool);
    if (!isInit) setActActive(t);
    refresher?.refresh();
    return t;
  }

  const view = (ViewManagerInst.returnView() as EditView);
  return (
    <tbody>
      {
        (editViewModeCtx && (editViewModeCtx.editMode === EditViewMode.point ||
          editViewModeCtx.editMode === EditViewMode.edge ||
          editViewModeCtx.editMode === EditViewMode.face)) &&
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
      }
      {
        (editViewModeCtx && (editViewModeCtx.editMode === EditViewMode.edge ||
          editViewModeCtx.editMode === EditViewMode.face)) &&
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
      }
      {
        (editViewModeCtx && (editViewModeCtx.editMode === EditViewMode.edge ||
          editViewModeCtx.editMode === EditViewMode.face)) &&
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
      }
      {
        (editViewModeCtx && (editViewModeCtx.editMode === EditViewMode.face)) &&
        <tr style={tableRowStyle(colorModeCtx)}>
          <td>
            <SubdivideButton text={'Surface Subdivision'} onClick={() => {
              if (actActive === ETools.surfaceSubdivision) return;
              setTool(ETools.surfaceSubdivision);
              view.setGizmoMode(GizmoModes.gizmoUnused);
            }}
            className='fill-parent-width'
            active={actActive === ETools.surfaceSubdivision} />
          </td>
        </tr>
      }
    </tbody>
  );
}
