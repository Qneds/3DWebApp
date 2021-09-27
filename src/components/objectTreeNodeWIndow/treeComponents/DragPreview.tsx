import {DragLayerMonitorProps} from '@minoru/react-dnd-treeview';
import ColorModeContext from 'contexts/ColorModeContext';
import React from 'react';


export interface DragPreviewProps {
  monitorProps: DragLayerMonitorProps<unknown>;
}

const DragPreview = (props: DragPreviewProps): JSX.Element => {
  const item = props.monitorProps.item;
  return (
    <div
      className='node-element-drag'
      style={{backgroundColor: 'red'}}>
      <p>{item.text}</p>
    </div>
  );
};

export default DragPreview;
