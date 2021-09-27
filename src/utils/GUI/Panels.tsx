import React, {useContext} from 'react';
import {StandardReactPropsInt} from './Standard';

import 'styles/cardBodyStyles.css';
import ColorModeContext from 'contexts/ColorModeContext';


export interface PanelTitleProps extends StandardReactPropsInt {
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PanelBodyProps extends StandardReactPropsInt {
}

export interface CardBodyProps extends StandardReactPropsInt {
  title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CardBodyMainLabelProps extends StandardReactPropsInt {
}

export interface PropertyProps extends StandardReactPropsInt {
  label?: string;
}

export const PanelTitle = (props: PanelTitleProps):JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <div style={{
      display: 'flex',
      backgroundColor: colorModeCtx?.colorMode.secondaryColor,
      height: '40px',
      maxHeight: '40px',
      color: colorModeCtx?.colorMode.accentColor,
      fontStyle: 'italic',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
    }}
    className={props.className}>
      {props.title}
    </div>
  );
};

export const PanelBody = (props: PanelBodyProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);

  return (
    <div className={props.className} style={{
      padding: '1rem',
      backgroundColor: colorModeCtx?.colorMode.backgroundColor,
      ...props.style}}>
      {props.children}
    </div>
  );
};

export const CardBody = (props: CardBodyProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);

  return (
    <fieldset
      style={{
        borderColor: colorModeCtx?.colorMode.accentColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '0.5rem',
        ...props.style,
      }}
      className={`card-body-frame ${props.className ? props.className : ''}`}
    >
      {props.title && <legend
        className='card-body-frame'
        style={{
          color: colorModeCtx?.colorMode.accentColor,
        }}
      >
        {props.title}
      </legend>}
      {props.children}
    </fieldset>
  );
};

export const CardBodyMainLabel =
(props: CardBodyMainLabelProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <div
      className={`card-body-label ${props.className ? props.className : ''}`}
      style={{
        backgroundColor: colorModeCtx?.colorMode.accentColor,
        color: colorModeCtx?.colorMode.secondaryColor,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};

export const Property = (props: PropertyProps): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: '0.5em',
      paddingBottom: '0.5em',
      ...props.style,
    }}
    className={props.className}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: colorModeCtx?.colorMode.primaryColor,
        paddingRight: '1em',
      }}>
        {props.label ? `${props.label}: ` : ' '}
      </span>
      <div style={{
        display: 'flex',
        flexGrow: 1,
      }}>
        {props.children}
      </div>
    </div>
  );
};
