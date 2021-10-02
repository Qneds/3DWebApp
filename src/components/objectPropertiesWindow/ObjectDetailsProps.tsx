import React, {useContext, useEffect, useState} from 'react';
import {FormFeedback} from 'reactstrap';
import {ContainerWithRows, ContainerWithColumns,
  InputPropertyWithConfirm, InputProperty}
  from 'utils/GUI/GUIUtils';
import {Property} from 'utils/GUI/Panels';

import 'styles/guiUtilsStyles.css';
import STATE from 'WebGL/State';
import {Refresher, RefreshMechanism} from 'contexts/RefresherContext';

const ObjectDetailsProps = (): JSX.Element => {
  const refreshResponse = useContext(RefreshMechanism);
  const refresher = useContext(Refresher);
  const [newName, setNewName] = useState('');
  const [oldName, setOldName] = useState('');
  const [isNameInvalid, setIsNameInvalid] = useState(false);

  const onNewNameConfirm =
  (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (newName) {
      const obj = STATE.getSelectedObject();
      if (obj && refresher) {
        obj.setName(newName);
        setNewName('');
        refresher.refresh();
      }
    } else {
      setIsNameInvalid(true);
    }
  };

  const onNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNameInvalid(false);
    setNewName(event.target.value);
  };

  useEffect(() => {
    const obj = STATE.getSelectedObject();
    if (obj) {
      setOldName(obj.getName());
    }
  }, [, refreshResponse]);

  return (
    <Property label='Object name'>
      <ContainerWithRows>
        <InputProperty
          className='mb-1'
          disabled
          value={oldName}/>
        <ContainerWithColumns>
          <InputPropertyWithConfirm
            invalid={isNameInvalid}
            onChange={onNewNameChange}
            onConfirm={onNewNameConfirm}
            onFocus={() => setNewName('')}
            value={newName}
          />
        </ContainerWithColumns>
        <FormFeedback
          className='input-error'
          style={{
            display: isNameInvalid ? 'block' : 'none',
          }}
        >
          Provided value is invalid
        </FormFeedback>
      </ContainerWithRows>
    </Property>
  );
};

export default ObjectDetailsProps;
