import React, {useContext, useEffect} from 'react';
import {AppMode} from 'components/modeNavBar/ModeNavBar';
import ColorModeContext from 'contexts/ColorModeContext';
import EditModeContext from 'contexts/EditModeContext';
import ModeContext from 'contexts/ModeContext';

import 'styles/generalStyles.css';
import {MainViewToolsSelector} from './MainViewTools';
import {EditViewToolsSelector} from './EditViewTools';
import ToolsManagerInst from 'components/toolsWIndow/ToolsManager';


const ToolsWindow =
    (props : {children : React.ReactNode[] | React.ReactNode}):
        JSX.Element => {
      const colorModeCtx = useContext(ColorModeContext);
      return (
        <div>
          <table
            className='fill-parent-width'>
            {ToolsManagerInst.returnToolsComponent()}
          </table>
        </div>
      );
    };

export default ToolsWindow;
