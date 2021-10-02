import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Main from 'components/Main';
import ColorMode, {ColorModeContextInt, ColorModeContextValues,
  injectStyle} from 'contexts/ColorModeContext';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

/**
 * Main App
 * @return {JSX.Element}
 */
function App(): JSX.Element {
  const [colorMode, setColorMode] = useState<ColorModeContextValues>({
    primaryColor: '#ececec',
    backgroundColor: '#787878',
    accentColor: '#bce2e9',
    secondaryColor: '#444444',
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <ColorMode.Provider value={{colorMode: colorMode, setColorMode}}>
        {injectStyle(colorMode)}
        <Main/>
      </ColorMode.Provider>
    </DndProvider>
  );
}

export default App;
