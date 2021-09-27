import React from 'react';

const Drawer = (props: {toDraw: (() => JSX.Element) | undefined}):
    JSX.Element => {
  return (
    <>
      {props.toDraw}
    </>
  );
};

export default Drawer;
