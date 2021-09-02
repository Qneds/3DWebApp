import React, {useState} from 'react';
import {useContext} from 'react';
import {DropdownItem} from 'reactstrap';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';
import {GUIDropdown} from 'utils/GUI/GUIUtils';
import {MdArrowUpward, MdArrowDownward, MdDehaze} from 'react-icons/md';
import ViewManagerInst from 'WebGL/Views/ViewManager';

const MainNavBar = (): JSX.Element => {
  const color = useContext(ColorModeContext);
  const [t, sT] = useState(false);

  return (
    <Frame
      backgroundColor={color?.colorMode.backgroundColor}
      borderColor={color?.colorMode.accentColor}
      borderWidth={2}>
      <GUIDropdown
        text={'Menu'}
        ico={<MdDehaze/>}
        onClick={() => {
          console.log('y');
          sT(!t);
        }}>
        <DropdownItem>Menu</DropdownItem>
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
