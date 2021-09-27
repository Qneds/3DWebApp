import React, {useContext} from 'react';
import {useState, useEffect} from 'react';

import {Resizable} from 'react-resizable';
import {Element} from 'react-scroll';
import {LoremIpsum} from 'react-lorem-ipsum';


import MainNavBar from 'components/mainNavBar/MainNavBar';
import ModeNavBar, {AppMode} from 'components/modeNavBar/ModeNavBar';
import ToolsWindow from 'components/toolsWIndow/ToolsWindow';
import ObjectTreeNodeWindow
  from 'components/objectTreeNodeWIndow/ObjectTreeNodeWindow';
import Viewport from 'components/viewport/Viewport';
import ObjectPropertiesWindow from
  'components/objectPropertiesWindow/ObjectPropertiesWindow';
import ToolsPropertiesWindow from
  'components/toolsPropertiesWindow/ToolsPropertiesWindow';
import StatusFooter from
  'components/footer/StatusFooter';
import ModeContext from 'contexts/ModeContext';
import EditModeContext from 'contexts/EditModeContext';
import {EditViewMode} from 'WebGL/Views/EditView';
import {PanelTitle} from 'utils/GUI/Panels';
import {Refresher, RefreshMechanism} from 'contexts/RefresherContext';
import ColorModeContext from 'contexts/ColorModeContext';
import RefresherComp from './Refresher';
import ModalSystem from './ModalSystem';

// TODO depend these on the screen size
const initMenusWidth = 300;
const menuMinHorSize = 100;
const viewportMinSize = 300;
const menuMinVerSize = 100;


const Main = (): JSX.Element => {
  const [{widthLeftHor, heightLeftHor}, setDimLeftHor] =
    useState({widthLeftHor: initMenusWidth, heightLeftHor: initMenusWidth});
  const [{widthLeftVer, heightLeftVer}, setDimLeftVer] =
    useState({widthLeftVer: initMenusWidth, heightLeftVer: initMenusWidth});
  const [{widthRightHor, heightRightHor}, setDimRightHor] =
    useState({widthRightHor: initMenusWidth, heightRightHor: initMenusWidth});
  const [{widthRightVer, heightRightVer}, setDimRightVer] =
    useState({widthRightVer: initMenusWidth, heightRightVer: initMenusWidth});

  const [{subWindowWidth, subWindowHeight}, setDimSubWindow] =
    useState({subWindowWidth: 0, subWindowHeight: 0});


  const [viewMode, setViewMode] = useState(AppMode.MainMode);
  const [editViewMode, setEditViewMode] = useState(EditViewMode.point);
  const [refreshValue, setRefreshValue] = useState(false);


  const onResizeLeftHor = (event, {element, size, handle}) => {
    if (size.width + widthRightHor + viewportMinSize < subWindowWidth &&
        size.width > menuMinHorSize) {
      setDimLeftHor({widthLeftHor: size.width, heightLeftHor: size.height});
    }
  };

  const onResizeLeftVer = (event, {element, size, handle}) => {
    if (size.height > menuMinVerSize &&
        subWindowHeight - size.height > menuMinVerSize) {
      setDimLeftVer({widthLeftVer: size.width, heightLeftVer: size.height});
    }
  };

  const onResizeRightHor = (event, {element, size, handle}) => {
    if (size.width + widthLeftHor + viewportMinSize < subWindowWidth &&
        size.width > menuMinHorSize) {
      setDimRightHor({widthRightHor: size.width, heightRightHor: size.height});
    }
  };

  const onResizeRightVer = (event, {element, size, handle}) => {
    if (size.height > menuMinVerSize &&
        subWindowHeight - size.height > menuMinVerSize) {
      setDimRightVer({widthRightVer: size.width, heightRightVer: size.height});
    }
  };

  useEffect(() => {
    setDimLeftHor({widthLeftHor: widthLeftHor, heightLeftHor: subWindowHeight});
    setDimRightHor({widthRightHor: widthRightHor,
      heightRightHor: subWindowHeight});


    setDimLeftVer({widthLeftVer: widthLeftVer,
      heightLeftVer: subWindowHeight/2});
    setDimRightVer({widthRightVer: widthRightVer,
      heightRightVer: subWindowHeight/2});
  }, [subWindowWidth, subWindowHeight]);

  useEffect(() => {
    setDimLeftVer({widthLeftVer: widthLeftHor, heightLeftVer: heightLeftVer});
  }, [heightLeftVer, widthLeftHor]);

  useEffect(() => {
    setDimRightVer({widthRightVer: widthRightHor,
      heightRightVer: heightRightVer});
  }, [heightRightVer, widthRightHor]);

  useEffect(() => {
    const subWindow = document.querySelector('#resizableMain');
    if (subWindow) {
      setDimSubWindow({subWindowWidth: subWindow.clientWidth,
        subWindowHeight: subWindow.clientHeight});
    }
  }, []);

  const colorModeCtx = useContext(ColorModeContext);

  return (
    <RefresherComp>
      <ModalSystem>
        <ModeContext.Provider
          value={{appMode: viewMode, setAppMode: setViewMode}}>
          <EditModeContext.Provider
            value={{editMode: editViewMode, setEditMode: setEditViewMode}}>
            <div
              style={{
                backgroundColor: colorModeCtx?.colorMode.backgroundColor,
                height: '100%',
                display: 'flex',
                flexFlow: 'column',
              }}>
              <MainNavBar/>
              <div
                id="resizableMain"
                style={{
                  position: 'relative',
                  height: '100%',
                  flexGrow: 1,
                }}>
                <Resizable
                  style={{
                    position: 'relative',
                  }}
                  width={widthLeftHor}
                  height={heightLeftHor}
                  resizeHandles={['e']}
                  handle={
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      width: '10px',
                      height: '100%',
                      float: 'right',
                    }}>
                    </div>
                  }
                  onResize={onResizeLeftHor}>
                  <div
                    style={{
                      display: 'flex',
                      flexFlow: 'column',
                      width: widthLeftHor + 'px',
                      height: heightLeftHor + 'px',
                    }}>
                    <Resizable
                      style={{
                        position: 'relative',
                      }}
                      width={widthLeftVer}
                      height={heightLeftVer}
                      resizeHandles={['s']}
                      onResize={onResizeLeftVer}
                      handle={
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          width: '100%',
                          height: '10px',
                        }}>
                        </div>
                      }>
                      <div
                        style={{
                          width: widthLeftVer + 'px',
                          height: heightLeftVer + 'px',
                        }}>
                        <PanelTitle title='Tools'/>
                        <Element
                          style={{
                            height: heightLeftVer - 40,
                            overflow: 'scroll',
                          }}>
                          <ToolsWindow>
                            <LoremIpsum p={5} />
                          </ToolsWindow>
                        </Element>
                      </div>
                    </Resizable>
                    <div
                      style={{
                        flexGrow: 1,
                      }}>
                      <PanelTitle title='Tool properties'/>
                      <Element
                        style={{
                          height: subWindowHeight - heightLeftVer - 40,
                          overflow: 'scroll',
                        }}
                      >
                        <ToolsPropertiesWindow/>
                      </Element>
                    </div>
                  </div>
                </Resizable>
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    height: '100%',
                    width:
                      `calc(100% - ${widthLeftHor}px - ${widthRightHor}px)`,
                    marginLeft: `${widthLeftHor}px`,
                    marginRight: `${widthRightHor}px`,
                    overflow: 'auto',
                    display: 'flex',
                    flexFlow: 'column',
                  }}>
                  <div
                    style={{
                      width: '100%',
                    }}>
                    <ModeNavBar/>
                  </div>
                  <div
                    style={{
                      flexGrow: 1,
                    }}>
                    <Viewport/>
                  </div>
                </div>
                <div>
                  <Resizable
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      float: 'left',
                    }}
                    width={widthRightHor}
                    height={heightRightHor}
                    resizeHandles={['w']}
                    handle={
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        width: '10px',
                        height: '100%',
                        float: 'right',
                      }}>
                      </div>
                    }
                    onResize={onResizeRightHor}>
                    <div
                      style={{
                        width: widthRightHor + 'px',
                        height: heightRightHor + 'px',
                      }}>
                      <Resizable
                        style={{
                          position: 'relative',
                        }}
                        width={widthRightVer}
                        height={heightRightVer}
                        resizeHandles={['s']}
                        onResize={onResizeRightVer}
                        handle={
                          <div style={{
                            position: 'absolute',
                            bottom: '0',
                            width: '100%',
                            height: '10px',
                          }}>
                          </div>
                        }>
                        <div
                          style={{
                            width: widthRightVer + 'px',
                            height: heightRightVer + 'px',
                          }}
                        >
                          <PanelTitle title='Navigation tree'/>
                          <Element
                            style={{
                              height: heightRightVer - 40,
                              overflow: 'scroll',
                            }}
                          >
                            <ObjectTreeNodeWindow/>
                          </Element>
                        </div>
                      </Resizable>
                      <div
                        style={{
                          flexGrow: 1,
                        }}>
                        <PanelTitle title='Object properties'/>
                        <Element
                          style={{
                            height: subWindowHeight - heightRightVer - 40,
                            overflow: 'scroll',
                          }}>
                          <ObjectPropertiesWindow/>
                        </Element>
                      </div>
                    </div>
                  </Resizable>
                </div>
              </div>
              <StatusFooter/>
            </div>
          </EditModeContext.Provider>
        </ModeContext.Provider>
      </ModalSystem>
    </RefresherComp>
  );
};

export default Main;
