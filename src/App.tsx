import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Main from 'components/Main';
import ColorMode, {ColorModeContextInt, ColorModeContextValues,
  injectStyle} from 'contexts/ColorModeContext';

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
    <ColorMode.Provider value={{colorMode: colorMode, setColorMode}}>
      {injectStyle(colorMode)}
      <Main/>
    </ColorMode.Provider>
  );
}

export default App;
