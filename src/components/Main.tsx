import React from 'react';
import {useState, useEffect} from 'react';

import {Resizable} from 'react-resizable';
import {Element} from 'react-scroll';
import {LoremIpsum} from 'react-lorem-ipsum';


import MainNavBar from 'components/mainNavBar/MainNavBar';
import ModeNavBar from 'components/modeNavBar/ModeNavBar';
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

// TODO depend these on the screen size
const initMenusWidth = 300;
const menuMinHorSize = 100;
const viewportMinSize = 300;
const menuMinVerSize = 100;


const Main = (): JSX.Element=> {
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


  const [viewId, setViewId] = useState(0);


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

  return (
    <div
      style={{
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
          backgroundColor: '#257457',

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
              backgroundColor: '#888888',
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
              backgroundColor: '#444444',
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
                  backgroundColor: '#df5c46',
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  height: '10px',
                }}>
                </div>
              }>
              <div
                style={{
                  backgroundColor: '#555555',
                  width: widthLeftVer + 'px',
                  height: heightLeftVer + 'px',
                }}>
                <Element
                  style={{
                    height: heightLeftVer,
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
                backgroundColor: '#04957f',
              }}>
              <Element
                style={{
                  height: subWindowHeight - heightLeftVer,
                  overflow: 'scroll',
                }}>

                <LoremIpsum p={3} />

              </Element>
              {/* <ToolsPropertiesWindow/>*/}
            </div>
          </div>
        </Resizable>
        <div
          style={{
            position: 'absolute',
            top: '0',
            height: '100%',
            width: `calc(100% - ${widthLeftHor}px - ${widthRightHor}px)`,
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
            <ModeNavBar updateViewId={setViewId}/>
          </div>
          <div
            style={{
              flexGrow: 1,
              backgroundColor: '#324552',
            }}>
            <Viewport viewId={viewId} />
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
                backgroundColor: '#888888',
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
                backgroundColor: '#444444',
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
                    backgroundColor: '#df5c46',
                    position: 'absolute',
                    bottom: '0',
                    width: '100%',
                    height: '10px',
                  }}>
                  </div>
                }>
                <div
                  style={{
                    backgroundColor: '#555555',
                    width: widthRightVer + 'px',
                    height: heightRightVer + 'px',
                  }}>
                  <ObjectTreeNodeWindow>
                                        right
                  </ObjectTreeNodeWindow>
                </div>
              </Resizable>
              <ObjectPropertiesWindow/>
            </div>
          </Resizable>
        </div>
      </div>
      <StatusFooter/>
    </div>
  );
};

export default Main;
