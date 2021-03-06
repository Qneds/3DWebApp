import React, {useContext, useEffect, useState} from 'react';
import Frame from 'utils/Frame';
import Colors from 'utils/Colors';
import ToolsManagerInst from 'components/toolsWIndow/ToolsManager';
import {PanelBody} from 'utils/GUI/Panels';
import {RefreshMechanism} from 'contexts/RefresherContext';
import Drawer from './Drawer';
import ColorModeContext from 'contexts/ColorModeContext';


const ToolsPropertiesWindow = (): JSX.Element=> {
  const refreshMechanism = useContext(RefreshMechanism);
  const colorModeCtx = useContext(ColorModeContext);
  const [rerender, setRerender] = useState(true);
  /*
  useEffect(() =>{
    if (rerender) {
      setRerender(false);
    }
  }, [refreshMechanism]);

  useEffect(() =>{
    if (!rerender) {
      setRerender(true);
    }
  }, [rerender]);*/
  /* let comp: (() => JSX.Element) | undefined = undefined;
  if (ToolsManagerInst.getSelectedTool()) {
    comp = (ToolsManagerInst.getSelectedTool()?.renderToolPropertiesCard);
  }*/
  const tool = ToolsManagerInst.getSelectedTool();
  const comp = tool ? tool.renderToolPropertiesCard() : (<></>);
  return (
    <Frame
      style={{
        height: '100%',
        backgroundColor: colorModeCtx?.colorMode.backgroundColor,
      }}
    >
      <PanelBody>
        {rerender && tool !== null ?
          comp :
          <div/>
        }
      </PanelBody>
    </Frame>
  );
};

export default ToolsPropertiesWindow;
