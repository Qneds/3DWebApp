import React, {useState} from 'react';
import {CheckboxProperty} from 'utils/GUI/GUIUtils';
import {CardBody, Property} from 'utils/GUI/Panels';
import STATE from 'WebGL/State';

const initCheckbox = (): [boolean, boolean]=> {
  const obj = STATE.getSelectedObject();
  if (!obj) {
    return [false, false];
  }

  const mesh = obj.getMesh();
  if (!mesh) {
    return [false, false];
  }

  return [true, mesh.isEnabled()];
};

const MeshProps = (): JSX.Element => {
  const [exists, isEnabled] = initCheckbox();
  const [checked, setChecked] = useState(isEnabled);

  return (
    <CardBody>
      <Property label='show mesh'>
        <CheckboxProperty
          checked={checked}
          disabled={!exists}
          onChange={(e) => {
            setChecked(e.target.checked);
            STATE.getSelectedObject()?.getMesh()?.
                enableDisable(e.target.checked);
          }}
        />
      </Property>
    </CardBody>
  );
};

export default MeshProps;
