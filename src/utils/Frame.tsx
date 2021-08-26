import React from 'react';
import Colors from 'utils/Colors';

export interface FrameProps {
    children: React.ReactNode | React.ReactNode[]
    bordersEnabled?: string
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    style?: React.CSSProperties
    id?: string
}

const Frame = (props: FrameProps) => {
  let borderChooser = props.bordersEnabled;
  if (!borderChooser) {
    borderChooser = 'wens';
  }

  let backgroundColor = props.backgroundColor;
  if (!backgroundColor) {
    backgroundColor = '#FFFFFF';
  }

  let borderColor = props.borderColor;
  if (!borderColor) {
    borderColor = '#000000';
  }

  let borderWidth = props.borderWidth;
  if (!borderWidth) {
    borderWidth = 0;
  }

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        borderStyle: 'solid',
        borderColor: borderColor,
        borderTopWidth:
            /(n|N)/.test(borderChooser) ? `${borderWidth}px` : '0px',
        borderRightWidth:
            /(e|E)/.test(borderChooser) ? `${borderWidth}px` : '0px',
        borderBottomWidth:
            /(s|S)/.test(borderChooser) ? `${borderWidth}px` : '0px',
        borderLeftWidth:
            /(w|W)/.test(borderChooser) ? `${borderWidth}px` : '0px',
        ...props.style,
      }}>
      {props.children}
    </div>
  );
};

export default Frame;
