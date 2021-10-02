import {DragLayerMonitorProps} from '@minoru/react-dnd-treeview';
import ColorModeContext from 'contexts/ColorModeContext';
import React, {useContext} from 'react';


export interface DragPreviewProps {
  monitorProps: DragLayerMonitorProps<unknown>;
}

const DragPreview = (props: DragPreviewProps): JSX.Element => {
  const ColorModeCtx = useContext(ColorModeContext);
  const item = props.monitorProps.item;
  return (
    <span
      className='node-element-drag'
      style={{
        color: ColorModeCtx?.colorMode.secondaryColor,
        backgroundColor: ColorModeCtx?.colorMode.accentColor,
      }}
    >
      {item.text}
    </span>
  );
};

export default DragPreview;
