import ColorModeContext from 'contexts/ColorModeContext';
import {vec4} from 'gl-matrix';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {CardBody, Property} from 'utils/GUI/Panels';
import STATE from 'WebGL/State';
import {SketchPicker} from 'react-color';
import ModalSystemContext from 'contexts/ModalSystemContext';
import colorConverter from 'color-convert';

interface ColorInt {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
    a: number;
  },
  hsl: {
    h: number;
    s: number;
    l: number;
    a: number;
  },
}
const DEFAULT_COLOR: ColorInt = {
  hex: '#000',
  rgb: {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  },
  hsl: {
    h: 0,
    s: 0,
    l: 0,
    a: 1,
  },
};

const getColorFromSelectedObj = (): ColorInt => {
  const obj = STATE.getSelectedObject();
  if (!obj) return DEFAULT_COLOR;

  const colorVec4 = obj.getMaterial().getFaceMaterial().getColor();
  const rgbaObj = {
    r: Math.trunc(colorVec4[0]*255),
    g: Math.trunc(colorVec4[1]*255),
    b: Math.trunc(colorVec4[2]*255),
    a: colorVec4[3],
  };
  const hslArr = colorConverter.rgb.hsl(rgbaObj.r, rgbaObj.g, rgbaObj.b);

  const hslaObj = {
    h: hslArr[0],
    s: hslArr[1],
    l: hslArr[2],
    a: colorVec4[3],
  };

  return {
    hex: '#' + colorConverter.rgb.hex(rgbaObj.r, rgbaObj.g, rgbaObj.b),
    rgb: rgbaObj,
    hsl: hslaObj,
  };
};

const MaterialProps = (): JSX.Element=> {
  const colorModeCtx = useContext(ColorModeContext);
  const modalSystem = useContext(ModalSystemContext);
  const [chosenColor, setChosenColor] = useState(getColorFromSelectedObj());
  const [isColorPickerDisplayed, setIsColorPickerDisplayed] = useState(false);
  const colorPrev = useRef<ColorInt | null>(null);

  useEffect(() => {
    if (modalSystem?.isOpen && isColorPickerDisplayed) {
      setupPickerModal();
    }
  }, [chosenColor, modalSystem?.isOpen, isColorPickerDisplayed]);

  useEffect(() => {
    if (isColorPickerDisplayed) {
      setIsColorPickerDisplayed(modalSystem ? modalSystem.isOpen : false);
    }
  }, [modalSystem?.isOpen]);

  const setupPickerModal = () => {
    modalSystem?.setModalData({
      header: 'Choose color',
      body: (
        <div>
          <SketchPicker
            color={chosenColor.rgb}
            width={'auto'}
            onChange={(color) => {
              setChosenColor(color);
            }}
          />
        </div>
      ),
      onClose: () => setChosenColor(
        colorPrev.current ? colorPrev.current : DEFAULT_COLOR,
      ),
      onCancel: () => setChosenColor(
        colorPrev.current ? colorPrev.current : DEFAULT_COLOR,
      ),
      onOk: () => {
        STATE.getSelectedObject()?.getMaterial()
            .getFaceMaterial().setColor([
              chosenColor.rgb.r/255,
              chosenColor.rgb.g/255,
              chosenColor.rgb.b/255,
              chosenColor.rgb.a,
            ] as vec4);
      },
    });
  };

  console.log(chosenColor);
  return (<CardBody>
    <Property label='albedo'>
      <span
        onClick={() => {
          setupPickerModal();
          modalSystem?.open();
          colorPrev.current = chosenColor;
          setIsColorPickerDisplayed(true);
        }}
        style={{
          alignSelf: 'center',
          backgroundColor: chosenColor.hex,
          width: '1em',
          height: '1em',
          borderStyle: 'solid',
          borderWidth: '2px',
          borderRadius: '2px',
          borderColor: colorModeCtx?.colorMode.accentColor,
        }}
      />
    </Property>
  </CardBody>);
};

export default MaterialProps;
