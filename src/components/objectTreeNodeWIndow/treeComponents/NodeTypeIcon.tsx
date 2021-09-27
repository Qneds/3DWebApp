import React from 'react';
import {IoCubeOutline} from 'react-icons/io5';

import 'styles/nodeTreeStyles.css';


export interface TypeIconProps {
  droppable?: boolean;
  nodeType?: string;
}

const TypeIcon = (props: TypeIconProps): JSX.Element => {
  switch (props.nodeType) {
    case 'object': return <IoCubeOutline />;
    default: return (<></>);
  }
};

export default TypeIcon;
