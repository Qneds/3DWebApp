import React, {useState} from 'react';
import {Dropdown, DropdownItem, Input, Label} from 'reactstrap';
import {ExportObjItemProps} from '../MainNavBar';
import ExportToObj from './ExportToObj';

export interface ExportChildrenProps {
  exportChildren: boolean;
}

export interface ExportSettingsProps {
  exportChildren: boolean;
  changeExportChildren: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExportObjDropdown = (props: ExportSettingsProps): JSX.Element => {
  return (
    <>
      <DropdownItem
        header
      >
        Settings
      </DropdownItem>
      <DropdownItem
        toggle={false}
        onClick={() => {
          props.changeExportChildren(!props.exportChildren);
        }}
      >
        <Label>Save children &nbsp;</Label>
        <Input
          type='checkbox'
          checked={props.exportChildren}
        />
      </DropdownItem>

      <DropdownItem
        header
      >
        Actions
      </DropdownItem>
      <ExportActions exportChildren={props.exportChildren}/>
    </>
  );
};

const ExportActions = (props: ExportChildrenProps): JSX.Element => {
  return (
    <>
      <ExportToObj exportChildren={props.exportChildren}/>
    </>
  );
};

export default ExportObjDropdown;
