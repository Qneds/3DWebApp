import {createContext} from 'react';
import {EditViewMode} from 'WebGL/Views/EditView';

export interface EditModeContextInt {
  editMode: EditViewMode,
  setEditMode: React.Dispatch<React.SetStateAction<EditViewMode>>
}
const EditModeContext = createContext<EditModeContextInt | null>(null);

export default EditModeContext;
