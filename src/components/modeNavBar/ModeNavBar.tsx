import React from 'react';
import {useContext, useState} from 'react';
import {ButtonGroup} from 'reactstrap';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';

import {GUIButton} from 'utils/GUI/GUIUtils';

import {MdFilterNone, MdEdit} from 'react-icons/md';
import WebGLI from 'WebGL/WebGl';


const ModeNavBar = (): JSX.Element => {
  const color = useContext(ColorModeContext);

  const [selectedMode, setSelectedMode] = useState(0);

  /**
 *
 * @param {number} moneNum
 */
  function setMode(moneNum: number): void {
    setSelectedMode(moneNum);
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
              setMode(0);
            }}
            active={selectedMode === 0}
          />
          <GUIButton
            text={'Edit'}
            ico={<MdEdit/>}
            onClick={() =>{
              setMode(1);
            }}
            active={selectedMode === 1}/>
        </ButtonGroup>
      </Frame>
    </div>
  );
};

export default ModeNavBar;
