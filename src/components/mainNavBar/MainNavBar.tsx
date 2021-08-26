import React from 'react';
import {useContext} from 'react';
import {DropdownItem} from 'reactstrap';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';
import {GUIDropdown} from 'utils/GUI/GUIUtils';
import {MdArrowUpward, MdArrowDownward, MdDehaze} from 'react-icons/md';

const MainNavBar = (): JSX.Element => {
  const color = useContext(ColorModeContext);

  return (
    <Frame
      backgroundColor={color?.colorMode.backgroundColor}
      borderColor={color?.colorMode.accentColor}
      borderWidth={2}>
      <GUIDropdown
        text={'Menu'}
        ico={<MdDehaze/>}
        onClick={() => {
          '';
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
