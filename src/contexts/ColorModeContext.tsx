import React from 'react';
import {createContext} from 'react';

export interface ColorModeContextValues {
    backgroundColor: string,
    primaryColor: string,
    accentColor: string,
    secondaryColor: string
}

export interface ColorModeContextInt{
    colorMode: ColorModeContextValues,
    setColorMode: React.Dispatch<React.SetStateAction<ColorModeContextValues>>
}
const ColorModeContext = createContext<ColorModeContextInt | null>(null);

/**
 *
 * @param {ColorModeContextValues} colorMode
 * @return {JSX.Element}
 */
export function injectStyle(colorMode: ColorModeContextValues): JSX.Element {
  return (
    <style type="text/css">
      {`
                .btn-gui,
                .btn-secondary {
                    border-radius: 0px;
                    border-width: 0px;
                    background-color: ${colorMode.backgroundColor};
                    color: ${colorMode.primaryColor};
                }
                .btn-gui:hover,
                .btn-secondary:hover {
                    background-color: ${colorMode.backgroundColor};
                    color: ${colorMode.accentColor};
                    box-shadow: none;
                }

                .btn-gui:focus,
                .btn-gui:active,
                .btn-secondary.active,
                .btn-secondary.active:focus,
                .btn-secondary.dropdown-toggle:focus,
                dropdown-toggle btn btn-secondary {
                    background-color: ${colorMode.accentColor};
                    color: ${colorMode.backgroundColor};
                    border-width: 0px;
                    box-shadow: none;
                    height: 100%;
                }

                .dropdown-menu {

                }

                .dropdown-item {
                    
                }
            `}
    </style>
  );
}

export default ColorModeContext;
