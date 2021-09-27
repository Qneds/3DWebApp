import React, {useContext} from 'react';
import {useState} from 'react';
import {Button, ButtonDropdown,
  DropdownToggle, DropdownMenu, InputProps, Input} from 'reactstrap';

import {BsArrowsMove} from 'react-icons/bs';
import {CgArrowsExpandLeft} from 'react-icons/cg';
import {ImLoop2} from 'react-icons/im';
import ColorModeContext from 'contexts/ColorModeContext';

import Checkbox, {CheckboxProps} from '@mui/material/Checkbox';
import {SliderProps, Slider} from '@mui/material';
import {StandardReactPropsInt} from './Standard';


export interface GUIButtonPropsWithoutIcon {
  text?: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  active?: boolean;
  style?: React.CSSProperties;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement> | undefined;
}
export interface GUIButtonProps extends GUIButtonPropsWithoutIcon {
    ico?: React.ReactNode;
}

export interface GUIDropdownProps extends GUIButtonProps {
    children: React.ReactChild[] | React.ReactChild
}

export const GUIButton = (props : GUIButtonProps): JSX.Element=> {
  return (
    <Button
      className={`btn-gui ${props.className ? props.className : ''}`}
      onClick={props.onClick}
      innerRef={props.buttonRef}
      style={props.style}
      active={props.active ? props.active : false}>
      <span
        style={{
          marginRight: props.text ? '10px' : '0px',
          display: 'inline',
          width: '120%',
          height: '120%',
        }}>
        {props.ico}
      </span>
      {props.text && <span
        style={{
          display: 'inline',
        }}>
        {props.text}
      </span>}
    </Button>
  );
};

export const GUIDropdown = (props: GUIDropdownProps): JSX.Element => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <ButtonDropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      innerRef={props.buttonRef}
      onClick={props.onClick}
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

export const MoveButton =
  ({text, onClick, active, style, className, buttonRef}
    : GUIButtonPropsWithoutIcon)
  : JSX.Element => {
    return (
      <GUIButton
        text={text}
        buttonRef={buttonRef}
        className={className}
        style={style}
        ico={<BsArrowsMove/>}
        onClick={(e) => onClick(e)}
        active={active}
      />
    );
  };

export const RotateButton =
  ({text, onClick, active, style, className, buttonRef}
    : GUIButtonPropsWithoutIcon)
  : JSX.Element => {
    return (
      <GUIButton
        text={text}
        buttonRef={buttonRef}
        className={className}
        style={style}
        ico={<ImLoop2/>}
        onClick={(e) => onClick(e)}
        active={active}
      />
    );
  };

export const ScaleButton =
  ({text, onClick, active, style, className, buttonRef}
    : GUIButtonPropsWithoutIcon)
  : JSX.Element => {
    return (
      <GUIButton
        text={text}
        buttonRef={buttonRef}
        className={className}
        style={style}
        ico={<CgArrowsExpandLeft/>}
        onClick={(e) => onClick(e)}
        active={active}
      />
    );
  };

export const InputProperty = (props: InputProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <Input
      className='input-property-style'
      style={{
        color: colorModeCtx?.colorMode.primaryColor,
        backgroundColor: colorModeCtx?.colorMode.secondaryColor,
        borderColor: colorModeCtx?.colorMode.accentColor,
      }}
      {...props}
    />
  );
};

export const CheckboxProperty = (props: CheckboxProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <Checkbox
      sx={{
        'color': colorModeCtx?.colorMode.accentColor,
        '&.Mui-checked': {
          'color': colorModeCtx?.colorMode.accentColor,
        },
        '&.Mui-disabled': {
          'color': colorModeCtx?.colorMode.secondaryColor,
        },
      }}
      {...props}
    />
  );
};

export const SliderProperty = (props: SliderProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <Slider
      sx={{
        'color': colorModeCtx?.colorMode.accentColor,
        'height': '0.5em',
        '& .MuiSlider-rail': {
          'color': colorModeCtx?.colorMode.secondaryColor,
          'borderColor': 'black',
          'borderWidth': '1px',
          'borderStyle': 'solid',
        },
        '& .MuiSlider-track': {
          'color': colorModeCtx?.colorMode.accentColor,
          'borderColor': 'black',
          'borderWidth': '1px',
          'borderStyle': 'solid',
        },
        '& .MuiSlider-thumb': {
          'borderColor': 'black',
          'borderWidth': '1px',
          'borderStyle': 'solid',
          '&.Mui-focusVisible, &:hover': {
            'boxShadow': `0px 0px 0px 8px 
              ${colorModeCtx?.colorMode.accentColor}29`,
          },
          '&.Mui-active': {
            'boxShadow': `0px 0px 0px 14px 
              ${colorModeCtx?.colorMode.accentColor}29`,
          },
        },
        '& .MuiSlider-mark': {
          'display': 'none',
        },
        '& .MuiSlider-markLabel': {
          'color': colorModeCtx?.colorMode.primaryColor,
        },
      }}
      {...props}
    />
  );
};

export const SliderWithValueProperty = (props: SliderProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <>
      <SliderProperty {...props}/>
      <InputProperty bsSize={'sm'}
        value={props.value?.toString()}
        disabled style={{
          height: '50%',
          width: '50%',
          marginLeft: '1em',
          backgroundColor: 'grey',
          color: colorModeCtx?.colorMode.primaryColor,
        }}
      />
    </>
  );
};

export const ContainerWithRows =
(props: StandardReactPropsInt): JSX.Element=> {
  return (
    <div
      style={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        ...props.style,
      }}
      className={props.className}
    >
      {props.children}
    </div>
  );
};

export const ContainerWithColumns =
(props: StandardReactPropsInt): JSX.Element=> {
  return (
    <div
      style={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
        ...props.style,
      }}
      className={props.className}
    >
      {props.children}
    </div>
  );
};
