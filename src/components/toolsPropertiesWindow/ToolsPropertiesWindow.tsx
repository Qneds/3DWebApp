import React from 'react';
import Frame from 'utils/Frame';
import Colors from 'utils/Colors';

const ToolsPropertiesWindow = () => {
  return (
    <Frame
      backgroundColor={Colors.PrimaryGrey}
      borderColor={Colors.Turquoise}
      borderWidth={2}
      style={{
        height: '100%',
      }}>
        tools props
    </Frame>
  );
};

export default ToolsPropertiesWindow;
