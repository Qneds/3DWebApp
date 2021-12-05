import {RefreshMechanism} from 'contexts/RefresherContext';
import React, {useContext, useEffect, useState} from 'react';
import {CheckboxProperty} from 'utils/GUI/GUIUtils';
import {CardBody, Property} from 'utils/GUI/Panels';
import STATE from 'WebGL/State';

const initCheckbox = (): {exists: boolean, isEnabled: boolean} => {
  const obj = STATE.getSelectedObject();
  if (!obj) {
    return {exists: false, isEnabled: false};
  }

  const mesh = obj.getMesh();
  if (!mesh) {
    return {exists: false, isEnabled: false};
  }

  return {exists: true, isEnabled: mesh.isEnabled()};
};

const MeshProps = (): JSX.Element => {
  const refreshResponse = useContext(RefreshMechanism);
  const [info, setInfo] = useState(initCheckbox());
  const [checked, setChecked] = useState(info.isEnabled);

  useEffect(() => {
    const newInfo = initCheckbox();
    setInfo(newInfo);
    setChecked(newInfo.isEnabled);
  }, [, refreshResponse]);

  return (
    <CardBody>
      <Property label='show mesh'>
        <CheckboxProperty
          checked={checked}
          disabled={!info.exists}
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
