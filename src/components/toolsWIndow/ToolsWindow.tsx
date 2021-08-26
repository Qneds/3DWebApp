import React from 'react';


const ToolsWindow =
    (props : {children : React.ReactNode[] | React.ReactNode}):
        JSX.Element => {
      return (
        <div
          style={{
            backgroundColor: 'green',
          }}>
          {props.children}
        </div>
      );
    };

export default ToolsWindow;
