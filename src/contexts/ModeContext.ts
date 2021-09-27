import {AppMode} from 'components/modeNavBar/ModeNavBar';
import {createContext} from 'react';

export interface AppModeContextInt {
  appMode: AppMode,
  setAppMode: React.Dispatch<React.SetStateAction<AppMode>>
}
const AppModeContext = createContext<AppModeContextInt | null>(null);

export default AppModeContext;
