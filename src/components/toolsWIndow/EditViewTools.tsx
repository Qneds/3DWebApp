import React, {useContext, useEffect, useState} from 'react';
import {MoveButton, RotateButton, ScaleButton} from 'utils/GUI/GUIUtils';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import MainView from 'WebGL/Views/MainView';
import {GizmoModes} from 'WebGL/Editor/Gizmos/GizmoManager';
import {ETools, IViewToolSelector} from 'components/toolsWIndow/ToolsManager';
import EditView, {EditViewMode} from 'WebGL/Views/EditView';
import {tableRowStyle} from 'styles/jsStyles';
import ColorModeContext from 'contexts/ColorModeContext';
import EditModeContext from 'contexts/EditModeContext';

/**
 * Returns tools table for edit view
 * @param {IViewToolSelector} props
 * @return {JSX.Element}
 */
export function EditViewToolsSelector(props: IViewToolSelector): JSX.Element {
  const editViewModeCtx = useContext(EditModeContext);
  const [actActive, setActActive] = useState(ETools.move);
  const colorModeCtx = useContext(ColorModeContext);

  useEffect(() => {
    setActActive(ETools.move);
  }, [editViewModeCtx]);

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
              setActActive(ETools.move);
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
              setActActive(ETools.rotate);
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
              setActActive(ETools.scale);
              view.setGizmoMode(GizmoModes.scale);
            }}
            className='fill-parent-width'
            active={actActive === ETools.scale} />
          </td>
        </tr>
      }
    </tbody>
  );
}
