import React, {useRef, useState, useEffect} from 'react';
import {useContext} from 'react';
import {DropdownItem} from 'reactstrap';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';
import {GUIDropdown} from 'utils/GUI/GUIUtils';
import {MdArrowUpward, MdArrowDownward, MdDehaze} from 'react-icons/md';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import ModalSystemContext from 'contexts/ModalSystemContext';
import AddObjectModal from './addObjects/AddObjectModal';
import {GeometryBuilder} from 'WebGL/Objects/BasicMeshes/GeometryProvider';
import STATE from 'WebGL/State';
import Object3D from 'WebGL/Objects/Object3D';
import Mesh from 'WebGL/Objects/Mesh';
import {Refresher} from 'contexts/RefresherContext';

const MainNavBar = (): JSX.Element => {
  const color = useContext(ColorModeContext);
  const modalSystem = useContext(ModalSystemContext);
  const refresher = useContext(Refresher);
  const [t, sT] = useState(false);

  const error = useRef(false);
  const currentBuilderRef =
    useRef<GeometryBuilder | null | undefined>(undefined);

  return (
    <Frame
      backgroundColor={color?.colorMode.backgroundColor}
      borderColor={color?.colorMode.accentColor}
      borderWidth={2}>
      <GUIDropdown
        text={'Menu'}
        ico={<MdDehaze/>}
        onClick={() => {
          sT(!t);
        }}
      >
        <DropdownItem
          onClick={() => {
            modalSystem?.setModalData({
              header: 'Add Object',
              body: (
                <AddObjectModal
                  markError={(e: boolean) => error.current = e}
                  currentBuilderRef={currentBuilderRef}
                />
              ),
              onOk: () => {
                if (!error.current && currentBuilderRef.current !== undefined) {
                  let parent: Object3D | null= null;
                  const sObj = STATE.getSelectedObject();
                  const world = STATE.getWorld();
                  const newObj = new Object3D();
                  if (currentBuilderRef.current) {
                    newObj.setMesh(new Mesh(currentBuilderRef.current.build()));
                  }
                  if (sObj) {
                    parent = sObj;
                  } else if (world) {
                    parent = world;
                  }
                  if (parent) {
                    parent.addChild(newObj);
                    newObj.setParent(parent);
                    refresher?.refresh();
                  }
                }
                return !error.current;
              },
            });
            modalSystem?.open();
          }}
        >
          Add Object
        </DropdownItem>
      </GUIDropdown>
      <GUIDropdown
        text={'Import'}
        ico={<MdArrowUpward/>}
        onClick={() => {
          '';
        }}>
        <DropdownItem>Import</DropdownItem>
      </GUIDropdown>
      <GUIDropdown
        text={'Export'}
        ico={<MdArrowDownward/>}
        onClick={() => {
          '';
        }}>
        <DropdownItem>Export</DropdownItem>
      </GUIDropdown>
    </Frame>
  );
};

export default MainNavBar;
