import React, {useState} from 'react';
import {SliderProperty, SliderWithValueProperty} from 'utils/GUI/GUIUtils';
import {CardBody, CardBodyMainLabel,
  PanelBody, Property} from 'utils/GUI/Panels';

export interface IPropertiesCard {
  drawPropertiesCard(): JSX.Element
}

/**
 * Tool properties class
 */
export abstract class ToolProperties implements IPropertiesCard {
  /**
   * @return {JSX.Element}
   */
  drawPropertiesCard(): JSX.Element {
    return (
      <>
      </>
    );
  }
}

/**
 * General transform tools properties class
 */
export class MouseProperties extends ToolProperties {
  private readonly startingVal = 0.1;
  private readonly minVal = 0.01;
  private readonly maxVal = 10;
  private clickRaycastArea: number;

  /**
   *
   */
  constructor() {
    super();
    this.clickRaycastArea = this.startingVal;
  }

  /**
   * Returns max range on screen to hit object with raycast
   * @return {number}
   */
  public getClickRaycastArea(): number {
    return this.clickRaycastArea;
  }

  /**
   * @return {JSX.Element}
   */
  drawPropertiesCard(): JSX.Element {
    const MouseProperties = () => {
      const [value, setValue] = useState(this.clickRaycastArea);

      const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
        this.clickRaycastArea = newValue as number;
      };

      return (
        <CardBody title='Mouse properties'>
          <Property label='mouseRange'>
            <SliderWithValueProperty
              value={value}
              min={this.minVal}
              max={this.maxVal}
              step={this.minVal}
              onChange={handleChange}
              marks={
                [
                  {value: this.minVal, label: this.minVal},
                  {value: this.maxVal, label: this.maxVal},
                ]
              }/>
          </Property>
        </CardBody>
      );
    };
    return (
      <MouseProperties/>
    );
  }
}

/**
 * General transform tools properties class
 */
export class TransformToolProperties extends ToolProperties {
  private mouseProperties = MousePropertiesInst;

  private readonly startingVal = 1;
  private readonly minVal = 0.01;
  private readonly maxVal = 10;
  private speedFactor: number;

  private cardLabel: string
  private speedFactorLabel: string;

  /**
   * @param {string} cardLabel
   * @param {string} speedFactorLabel
   */
  constructor(cardLabel = 'Transforms Properties',
      speedFactorLabel = 'change factor' ) {
    super();
    this.speedFactor = this.startingVal;
    this.cardLabel = cardLabel;
    this.speedFactorLabel = speedFactorLabel;
  }

  /**
   * Returns mouse properties
   * @return {MouseProperties}
   */
  getMouseProperties(): MouseProperties {
    return this.mouseProperties;
  }

  /**
   * @return {JSX.Element}
   */
  drawPropertiesCard(): JSX.Element {
    const TransformProperties = () => {
      const [value, setValue] = useState(this.speedFactor);

      const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
        this.speedFactor = newValue as number;
      };
      return (
        <>
          {this.mouseProperties.drawPropertiesCard()}
          <CardBody title={this.cardLabel}>
            <Property label={this.speedFactorLabel}>
              <SliderWithValueProperty
                value={value}
                min={this.minVal}
                max={this.maxVal}
                step={this.minVal}
                onChange={handleChange}
                marks={
                  [
                    {value: this.minVal, label: this.minVal},
                    {value: this.maxVal, label: this.maxVal},
                  ]
                }/>
            </Property>
          </CardBody>
        </>
      );
    };
    return (
      <TransformProperties/>
    );
  }

  /**
   * Returns change's speed factor
   * @return {number}
   */
  public getSpeedFactor(): number {
    return this.speedFactor;
  }
}

/**
 * General transform tools properties class
 */
export class MoveToolProperties extends TransformToolProperties {
  /**
   *
   */
  constructor() {
    super('Move Properties');
  }
}

/**
 * General transform tools properties class
 */
export class RotateToolProperties extends TransformToolProperties {
  /**
   *
   */
  constructor() {
    super('Rotation Properties');
  }
}

/**
 * General transform tools properties class
 */
export class ScaleToolProperties extends TransformToolProperties {
  /**
   *
   */
  constructor() {
    super('Scale Properties');
  }
}

export const MousePropertiesInst = new MouseProperties();
export const TransformToolPropertiesInst = new TransformToolProperties();
export const MoveToolPropertiesInst = new MoveToolProperties();
export const RotateToolPropertiesInst = new RotateToolProperties();
export const ScaleToolPropertiesInst = new ScaleToolProperties();
