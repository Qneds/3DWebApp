import React, {Component, Dispatch, useRef} from 'react';
import {useContext, useState} from 'react';
import {ButtonGroup} from 'reactstrap';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';

import {GUIButton} from 'utils/GUI/GUIUtils';

import {MdFilterNone, MdEdit} from 'react-icons/md';
import WebGLI from 'WebGL/WebGl';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import MainView from 'WebGL/Views/MainView';
import AppModeContext from 'contexts/ModeContext';
import ModalSystemContext from 'contexts/ModalSystemContext';

export enum AppMode {
  MainMode = 0,
  EditMode = 1,
}

const ModeNavBar = () : JSX.Element => {
  const color = useContext(ColorModeContext);
  const appMode = useContext(AppModeContext);
  const modalSystem = useContext(ModalSystemContext);

  const [selectedMode, setSelectedMode] = useState(0);

  const mainModeBtnRef = useRef<HTMLButtonElement>(null);
  const editModeBtnRef = useRef<HTMLButtonElement>(null);

  /**
 *
 * @param {number} modeNum
 */
  function setMode(modeNum: number): void {
    if (!appMode) return;
    appMode.setAppMode(modeNum);
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
            buttonRef={mainModeBtnRef}
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
            buttonRef={editModeBtnRef}
            ico={<MdEdit/>}
            onClick={() =>{
              if (selectedMode === 1) return;
              try {
                setMode(1);
                ViewManagerInst.enableEditView();
              } catch (e: any) {
                const message = (e as Error).message;
                modalSystem?.setModalData({
                  header: 'Warning',
                  body: <>{message}</>,
                });
                modalSystem?.open();
                if (editModeBtnRef && editModeBtnRef.current &&
                    editModeBtnRef.current.blur) {
                  editModeBtnRef.current.blur();
                }
                setMode(selectedMode);
              }
            }}
            active={selectedMode === 1}/>
        </ButtonGroup>
      </Frame>
    </div>
  );
};

export default ModeNavBar;
