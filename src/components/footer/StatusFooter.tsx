import React from 'react';
import {useContext} from 'react';
import Frame from 'utils/Frame';
import Colors from 'utils/Colors';
import ColorModeContext from 'contexts/ColorModeContext';


const StatusFooter = () => {
  const color = useContext(ColorModeContext);

  return (
    <div
      style={{
        width: '100%',

      }}>
      <Frame
        backgroundColor={color?.colorMode.backgroundColor}
        borderColor={color?.colorMode.accentColor}
        borderWidth={2}>
                &nbsp;
      </Frame>
    </div>
  );
};

export default StatusFooter;
