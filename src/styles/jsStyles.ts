import React from 'react';
import {ColorModeContextInt} from 'contexts/ColorModeContext';

export const tableRowStyle = (styleRef: ColorModeContextInt | null):
    React.CSSProperties => {
  return {
    borderStyle: 'solid',
    borderWidth: '0.1em 0',
    borderColor: styleRef?.colorMode.accentColor,
  };
};
