import {ModalDataInt} from 'components/ModalSystem';
import {createContext} from 'react';

export interface ModalSystemContextInt {
  setModalData: React.Dispatch<React.SetStateAction<ModalDataInt | null>>;
  open: () => void;
  isOpen: boolean;
}
const ModalSystemContext = createContext<ModalSystemContextInt | null>(null);

export default ModalSystemContext;
