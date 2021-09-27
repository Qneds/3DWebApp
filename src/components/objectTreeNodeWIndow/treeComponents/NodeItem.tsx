import {NodeModel, useDragOver} from '@minoru/react-dnd-treeview';
import ColorModeContext, {ColorModeContextInt} from 'contexts/ColorModeContext';
import React, {useContext} from 'react';

import {RiArrowRightSFill} from 'react-icons/ri';
import {CssBaseline} from '@mui/material';

import colorConverter from 'color-convert';
import styled from 'styled-components';

import TypeIcon from
  'components/objectTreeNodeWIndow/treeComponents/NodeTypeIcon';
import Object3D from 'WebGL/Objects/Object3D';


export interface NodeItemProps {
  node: NodeModel<Object3D>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel<Object3D>['id']) => void;
  onSelect?: (node: NodeModel<Object3D>) => void;
}

interface HoverableProps {
  isSelected: boolean;
  backgroundColor: {r: number, g: number, b: number};
  colorMode: ColorModeContextInt | null
}

const Hoverable = styled.span`
border-radius: 0.2em;
padding-right: 0.5em;
color: ${(props: HoverableProps) => props.isSelected ?
  props.colorMode?.colorMode.accentColor :
  props.colorMode?.colorMode.primaryColor};
background-color: ${(props: HoverableProps) => props.isSelected ?
  props.colorMode?.colorMode.secondaryColor : ''};
&:hover {
  background-color: 
    rgba(${(props: HoverableProps) => props.backgroundColor.r}, 
    ${(props: HoverableProps) => props.backgroundColor.g}, 
    ${(props: HoverableProps) => props.backgroundColor.b}, 0.5);
}
`;

const NodeItem = (props: NodeItemProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const dragOverProps =
    useDragOver(props.node.id, props.isOpen, props.onToggle);

  const indent = `calc(${props.depth} * 1em`;

  const handleSelect = () => {
    if (props.onSelect) {
      props.onSelect(props.node);
    }
  };

  const colorRgb =
    colorConverter.hex.rgb(colorModeCtx?.colorMode.secondaryColor);

  return (
    <span
      className='node-element'
      style={{
        paddingInlineStart: indent,
      }}
      {...dragOverProps}
    >
      <CssBaseline />
      <span
        style={{
          width: '1em',
          color: colorModeCtx?.colorMode.primaryColor,
        }}
      >
        {props.node.droppable && props.node.data &&
          (props.node.data?.getChildrenList().length > 0) && (
          <span onClick={handleToggle}>
            <RiArrowRightSFill
              className={`expand-icon ${props.isOpen ? 'expanded' : ''}`}
            />
          </span>
        )}
      </span>
      <Hoverable
        isSelected={props.isSelected}
        colorMode={colorModeCtx}
        backgroundColor={{
          r: colorRgb[0] as number,
          g: colorRgb[1] as number,
          b: colorRgb[2] as number,
        }}
      >
        <span
          onClick={handleSelect}
        >
          <span
            style={{width: '1em', paddingLeft: '0.5em'}}
          >
            <TypeIcon nodeType={'object'} />
          </span>
          <span
            style={{paddingLeft: '0.2em'}}
          >
            {props.node.text}
          </span>
        </span>
      </Hoverable>
    </span>
  );
};

export default NodeItem;
