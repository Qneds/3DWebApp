import ToolsManagerInst from 'components/toolsWIndow/ToolsManager';
import React from 'react';
import {MoveToolProperties, RotateToolProperties,
  ScaleToolProperties} from './ToolsProperties';

export interface ITool {
  renderButton(): JSX.Element;
  renderToolPropertiesCard(): JSX.Element;
}

/**
 * Move Tool class
 */
export class MoveTool implements ITool {
  private properties = new MoveToolProperties();

  /**
   * @return {JSX.Element}
   */
  renderButton(): JSX.Element {
    return (<></>);
  }

  /**
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return this.properties.drawPropertiesCard();
  }

  /**
   * returns properties object
   * @return {MoveToolProperties}
   */
  getProperties(): MoveToolProperties {
    return this.properties;
  }
}

/**
 * Rotate Tool class
 */
export class RotateTool implements ITool {
  private properties = new RotateToolProperties();

  /**
   * @return {JSX.Element}
   */
  renderButton(): JSX.Element {
    return (<></>);
  }

  /**
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return this.properties.drawPropertiesCard();
  }

  /**
   * returns properties object
   * @return {MoveToolProperties}
   */
  getProperties(): RotateToolProperties {
    return this.properties;
  }
}

/**
 * Scale Tool class
 */
export class ScaleTool implements ITool {
  private properties = new ScaleToolProperties();
  /*
  /**
   * @param {number} properties

  constructor(properties: number) {
    console.log(properties);
  }
*/
  /**
   * @return {JSX.Element}
   */
  renderButton(): JSX.Element {
    return (<></>);
  }

  /**
   * @return {JSX.Element}
   */
  renderToolPropertiesCard(): JSX.Element {
    return this.properties.drawPropertiesCard();
  }

  /**
   * returns properties object
   * @return {MoveToolProperties}
   */
  getProperties(): ScaleToolProperties {
    return this.properties;
  }
}
/*
export const MoveToolInst = new MoveTool();
export const RotateToolInst = new RotateTool();
export const ScaleToolInst = new ScaleTool();

ToolsManagerInst.getSelectedToolByType(ScaleTool);
*/
