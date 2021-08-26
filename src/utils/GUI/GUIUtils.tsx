import React from 'react';
import {useState} from 'react';
import {Button, ButtonDropdown,
  DropdownToggle, DropdownMenu} from 'reactstrap';


export interface GUIButtonProps {
    text : string;
    ico: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLElement>;
    active?: boolean;
}

export interface GUIDropdownProps extends GUIButtonProps {
    children: React.ReactChild[] | React.ReactChild
}

export const GUIButton = (props : GUIButtonProps): JSX.Element=> {
  return (
    <Button
      className="btn-gui"
      onClick={props.onClick}
      active={props.active ? props.active : false}>
      <span
        style={{
          marginRight: '10px',
          display: 'inline',
          width: '120%',
          height: '120%',
        }}>
        {props.ico}
      </span>
      <span
        style={{
          display: 'inline',
        }}>
        {props.text}
      </span>
    </Button>
  );
};

export const GUIDropdown = (props: GUIDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <ButtonDropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className="btn-gui">
      <DropdownToggle caret>
        <span
          style={{
            marginRight: '10px',
            display: 'inline',
            width: '120%',
            height: '120%',
          }}>
          {props.ico}
        </span>
        <span
          style={{
            display: 'inline',
          }}>
          {props.text}
        </span>
      </DropdownToggle>
      <DropdownMenu>
        {props.children}
      </DropdownMenu>
    </ButtonDropdown>
  );
};


