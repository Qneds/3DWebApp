import React, {Component, Dispatch} from 'react';
import {useContext, useState} from 'react';
import {ButtonGroup} from 'reactstrap';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';

import {GUIButton} from 'utils/GUI/GUIUtils';

import {MdFilterNone, MdEdit} from 'react-icons/md';
import WebGLI from 'WebGL/WebGl';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import MainView from 'WebGL/Views/MainView';

interface P {
  updateViewId: React.Dispatch<React.SetStateAction<number>>
}

const ModeNavBar = ({updateViewId}:
    {updateViewId: React.Dispatch<React.SetStateAction<number>>})
    : JSX.Element => {
  const color = useContext(ColorModeContext);

  const [selectedMode, setSelectedMode] = useState(0);

  /**
 *
 * @param {number} modeNum
 */
  function setMode(modeNum: number): void {
    updateViewId(modeNum);
    setSelectedMode(modeNum);
  }


  return (
    <div
      style={{
        width: '100%',
      }}>
      <Frame
        backgroundColor={color?.colorMode.backgroundColor}
        borderColor={color?.colorMode.accentColor}
        borderWidth={2}>
        <ButtonGroup>
          <GUIButton
            text={'Layout'}
            ico={<MdFilterNone/>}
            onClick={() =>{
              if (selectedMode === 0) return;
              setMode(0);
              ViewManagerInst.enableMainView();
            }}
            active={selectedMode === 0}
          />
          <GUIButton
            text={'Edit'}
            ico={<MdEdit/>}
            onClick={() =>{
              if (selectedMode === 1) return;
              setMode(1);
              ViewManagerInst.enableEditView();
            }}
            active={selectedMode === 1}/>
        </ButtonGroup>
      </Frame>
    </div>
  );
};

export default ModeNavBar;
