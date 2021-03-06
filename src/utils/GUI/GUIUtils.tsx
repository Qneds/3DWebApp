import React, {useContext, useEffect, useRef} from 'react';
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
import {IoGridSharp} from 'react-icons/io5';


export interface GUIButtonPropsWithoutIcon {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  active?: boolean;
  style?: React.CSSProperties;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement> | undefined;
}
export interface GUIButtonProps extends GUIButtonPropsWithoutIcon {
    ico?: React.ReactNode;
}

export interface GUIDropdownProps extends GUIButtonProps {
    isOpen?: boolean;
    toggle?: (() => void) | undefined;
    children: React.ReactChild[] | React.ReactChild
}

export interface InputPropertyWithConfirmProps extends InputProps {
  onConfirm?: React.MouseEventHandler<HTMLElement>;
}

export interface DisableProps extends StandardReactPropsInt {
  disabled: boolean;
}

export const GUIButton = (props : GUIButtonProps): JSX.Element=> {
  const buttonRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (props.active === undefined) {
      setIsActive(false);
    }
  }, [isActive]);
  return (
    <Button
      className={`btn-gui ${props.className ? props.className : ''}`}
      onClick={props.onClick}
      innerRef={props.buttonRef ? props.buttonRef : buttonRef}
      style={props.style}
      active={props.active !== undefined ? props.active : isActive}>
      <span
        style={{
          marginRight: props.text ? '10px' : '0px',
          display: 'inline',
          width: '120%',
          height: '120%',
          ...props.style,
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
      isOpen={props.isOpen === undefined ? dropdownOpen : props.isOpen}
      toggle={() => {
        if (props.toggle === undefined) {
          toggle();
        } else {
          props.toggle();
        }
      }}
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
        onClick={onClick}
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
        onClick={onClick}
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
        onClick={onClick}
        active={active}
      />
    );
  };

export const SubdivideButton =
({text, onClick, active, style, className, buttonRef}
  : GUIButtonPropsWithoutIcon): JSX.Element => {
  return (
    <GUIButton
      text={text}
      buttonRef={buttonRef}
      className={className}
      style={style}
      ico={<IoGridSharp/>}
      onClick={onClick}
      active={active}
    />
  );
};

export const InputProperty = (props: InputProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <Input
      {...props}
      className={
        `input-property-style ${props.className ? props.className : ''}`
      }
      style={{
        color: colorModeCtx?.colorMode.primaryColor,
        backgroundColor: props.disabled ?
          'grey' : colorModeCtx?.colorMode.secondaryColor,
        borderColor: colorModeCtx?.colorMode.accentColor,
        ...props.style,
      }}
    />
  );
};

export const InputPropertyWithConfirm =
(props: InputPropertyWithConfirmProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <>
      <Input
        {...props}
        className={
          `input-property-style ${props.className ? props.className : ''}`
        }
        style={{
          color: colorModeCtx?.colorMode.primaryColor,
          backgroundColor: props.disabled ?
            'grey' : colorModeCtx?.colorMode.secondaryColor,
          borderColor: colorModeCtx?.colorMode.accentColor,
          ...props.style,
        }}
      />
      <Button
        className='ms-2 p-2'
        color='success'
        onClick={props.onConfirm}
      >
        Confirm
      </Button>
    </>
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

export const Disable = (props: DisableProps): JSX.Element => {
  return (
    <div
      style={props.style}
      className={props.className}
    >
      {
        props.disabled &&
        <div
          className='disabled-overlay'
        />
      }
      {props.children}
    </div>
  );
};
