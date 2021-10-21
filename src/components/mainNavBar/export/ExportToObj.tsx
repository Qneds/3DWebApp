import React from 'react';
import {DropdownItem} from 'reactstrap';
import {saveFile} from 'utils/functions';
import {object3DToString}
  from 'WebGL/Editor/FileParsers/ObjFormatParsingFunctions';
import STATE from 'WebGL/State';
import {ExportChildrenProps} from './ExportObjDropdown';

const ExportToObj = (props: ExportChildrenProps): JSX.Element => {
  return (
    <DropdownItem
      onClick={() => {
        let obj = STATE.getSelectedObject();
        if (!obj) obj = STATE.getWorld();
        if (obj) {
          saveFile(
              `${obj.getName()}.obj`,
              object3DToString(obj, props.exportChildren),
          );
        }
      }}
    >
      Export to OBJ
    </DropdownItem>
  );
};

export default ExportToObj;
