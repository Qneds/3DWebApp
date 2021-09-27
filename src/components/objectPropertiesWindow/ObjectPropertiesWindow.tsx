import ColorModeContext from 'contexts/ColorModeContext';
import ModalSystemContext from 'contexts/ModalSystemContext';
import {RefreshMechanism} from 'contexts/RefresherContext';
import {vec3} from 'gl-matrix';
import React, {useContext, useEffect, useState} from 'react';
import {FormFeedback} from 'reactstrap';
import {CheckboxProperty, ContainerWithRows,
  InputProperty} from 'utils/GUI/GUIUtils';
import {CardBody, CardBodyMainLabel,
  PanelBody, Property} from 'utils/GUI/Panels';
import Object3D from 'WebGL/Objects/Object3D';
import STATE from 'WebGL/State';
import {toDegrees, toRadians} from 'WebGL/utils.ts/Math';
import ViewManagerInst from 'WebGL/Views/ViewManager';
import MaterialProps from './MaterialProps';
import MeshProps from './MeshProps';

const InvalidValueInfo = ({invalid}: {invalid: boolean}) => {
  return (
    <FormFeedback>
      Provided value is invalid
    </FormFeedback>
  );
};

const ObjectTreeNodeWindow = (): JSX.Element => {
  const colorModeCtx = useContext(ColorModeContext);
  const modalSystem = useContext(ModalSystemContext);
  const refresh = useContext(RefreshMechanism);

  const [currObj, setCurrObj] = useState<null | Object3D>(null);

  const [localRefresh, setLocalRefresh] = useState(false);

  const [posXInvalid, setPosXInvalid] = useState(false);
  const [posYInvalid, setPosYInvalid] = useState(false);
  const [posZInvalid, setPosZInvalid] = useState(false);

  const [posRenderInput, setPosRenderInput] =
    useState<[string, string, string]>(['', '', '']);

  const [orientXInvalid, setOrientXInvalid] = useState(false);
  const [orientYInvalid, setOrientYInvalid] = useState(false);
  const [orientZInvalid, setOrientZInvalid] = useState(false);

  const [orientRenderInput, setOrientRenderInput] =
    useState<[string, string, string]>(['', '', '']);

  const [scaleXInvalid, setScaleXInvalid] = useState(false);
  const [scaleYInvalid, setScaleYInvalid] = useState(false);
  const [scaleZInvalid, setScaleZInvalid] = useState(false);

  const [scaleRenderInput, setScaleRenderInput] =
    useState<[string, string, string]>(['', '', '']);

  const refreshLocally = () => {
    setLocalRefresh(!localRefresh);
  };

  useEffect(() => {
    const obj = STATE.getSelectedObject();
    if (currObj !== obj) {
      setCurrObj(obj);
    }
    setPosRenderInput([
      obj ? obj.getTransform().getPositionInParent()[0].toString() : '',
      obj ? obj.getTransform().getPositionInParent()[1].toString() : '',
      obj ? obj.getTransform().getPositionInParent()[2].toString() : '',
    ]);
    setOrientRenderInput([
      obj ? toDegrees(obj.getTransform().getOrientationInParent()[0])
          .toString() : '',
      obj ? toDegrees(obj.getTransform().getOrientationInParent()[1])
          .toString() : '',
      obj ? toDegrees(obj.getTransform().getOrientationInParent()[2])
          .toString() : '',
    ]);
    setScaleRenderInput([
      obj ? obj.getTransform().getScaleInParent()[0].toString() : '',
      obj ? obj.getTransform().getScaleInParent()[1].toString() : '',
      obj ? obj.getTransform().getScaleInParent()[2].toString() : '',
    ]);

    posXInvalid && setPosXInvalid(false);
    posYInvalid && setPosYInvalid(false);
    posZInvalid && setPosZInvalid(false);

    orientXInvalid && setOrientXInvalid(false);
    orientYInvalid && setOrientYInvalid(false);
    orientZInvalid && setOrientZInvalid(false);

    scaleXInvalid && setScaleXInvalid(false);
    scaleYInvalid && setScaleYInvalid(false);
    scaleZInvalid && setScaleZInvalid(false);
  }, [refresh]);

  const changeObjNumberProp = (
      event: React.FormEvent<HTMLInputElement>,
      signalError: React.Dispatch<React.SetStateAction<boolean>>,
      index: 0 | 1 | 2,
      getValues: () => vec3,
      setValues: (v: vec3) => void,
      inputVals: [string, string, string],
      setInputVals:
        React.Dispatch<React.SetStateAction<[string, string, string]>>,
      defaultValue: number,
      transformValueFunction?: ((n: number) => number) | undefined,
  ):void => {
    const value = event.currentTarget.value;
    const valueNum = parseFloat(value);
    const oldValues = getValues();

    setInputVals([
      index === 0 ? value : inputVals[0],
      index === 1 ? value : inputVals[1],
      index === 2 ? value : inputVals[2],
    ]);
    if (isNaN(valueNum)) {
      signalError(true);
      setValues([
        index === 0 ? (transformValueFunction ?
          transformValueFunction(defaultValue) : defaultValue) : oldValues[0],
        index === 1 ? (transformValueFunction ?
          transformValueFunction(defaultValue) : defaultValue) : oldValues[1],
        index === 2 ? (transformValueFunction ?
          transformValueFunction(defaultValue) : defaultValue) : oldValues[2],
      ] as vec3);
    } else {
      setValues([
        index === 0 ? (transformValueFunction ?
          transformValueFunction(valueNum) : valueNum) : oldValues[0],
        index === 1 ? (transformValueFunction ?
          transformValueFunction(valueNum) : valueNum) : oldValues[1],
        index === 2 ? (transformValueFunction ?
          transformValueFunction(valueNum) : valueNum) : oldValues[2],
      ] as vec3);
      signalError(false);
      refreshLocally();
    }
  };


  if (!currObj) {
    return (
      <PanelBody>
      </PanelBody>
    );
  }
  return (
    <PanelBody>

      <CardBodyMainLabel className='mg-b--em'>
        Details
      </CardBodyMainLabel>
      <CardBody>
        <Property label='Object data'>
          <CheckboxProperty
            value={0}
          />
        </Property>
      </CardBody>

      <CardBodyMainLabel className='mg-t--em'>
        Transformations
      </CardBodyMainLabel>
      <CardBody title='position'>
        <Property label='x'>
          <ContainerWithRows>
            <InputProperty
              invalid={posXInvalid}
              value={posRenderInput[0]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setPosXInvalid,
                    0,
                    currObj.getTransform().getPositionInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setPositionInParent
                        .bind(currObj.getTransform()),
                    posRenderInput,
                    setPosRenderInput,
                    0,
                );
                const mainView = ViewManagerInst.returnView() as any;
                if (mainView && mainView.recalculateGizmoPosition) {
                  mainView.recalculateGizmoPosition();
                }
              }}
            />
            <InvalidValueInfo invalid={posXInvalid}/>
          </ContainerWithRows>
        </Property>
        <Property label='y'>
          <ContainerWithRows>
            <InputProperty
              invalid={posYInvalid}
              value={posRenderInput[1]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setPosYInvalid,
                    1,
                    currObj.getTransform().getPositionInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setPositionInParent
                        .bind(currObj.getTransform()),
                    posRenderInput,
                    setPosRenderInput,
                    0,
                );
                const mainView = ViewManagerInst.returnView() as any;
                if (mainView && mainView.recalculateGizmoPosition) {
                  mainView.recalculateGizmoPosition();
                }
              }}
            />
            <InvalidValueInfo invalid={posYInvalid}/>
          </ContainerWithRows>
        </Property>
        <Property label='z'>
          <ContainerWithRows>
            <InputProperty
              invalid={posZInvalid}
              value={posRenderInput[2]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setPosZInvalid,
                    2,
                    currObj.getTransform().getPositionInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setPositionInParent
                        .bind(currObj.getTransform()),
                    posRenderInput,
                    setPosRenderInput,
                    0,
                );
                const mainView = ViewManagerInst.returnView() as any;
                if (mainView && mainView.recalculateGizmoPosition) {
                  mainView.recalculateGizmoPosition();
                }
              }}
            />
            <InvalidValueInfo invalid={posZInvalid}/>
          </ContainerWithRows>
        </Property>
      </CardBody>


      <CardBody title='orientation'>
        <Property label='x'>
          <ContainerWithRows>
            <InputProperty
              invalid={orientXInvalid}
              value={orientRenderInput[0]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setOrientXInvalid,
                    0,
                    currObj.getTransform().getOrientationInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setOrientationInParent
                        .bind(currObj.getTransform()),
                    orientRenderInput,
                    setOrientRenderInput,
                    0,
                    toRadians,
                );
              }}
            />
            <InvalidValueInfo invalid={orientXInvalid}/>
          </ContainerWithRows>
        </Property>
        <Property label='y'>
          <ContainerWithRows>
            <InputProperty
              invalid={orientYInvalid}
              value={orientRenderInput[1]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setOrientYInvalid,
                    1,
                    currObj.getTransform().getOrientationInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setOrientationInParent
                        .bind(currObj.getTransform()),
                    orientRenderInput,
                    setOrientRenderInput,
                    0,
                    toRadians,
                );
              }}
            />
            <InvalidValueInfo invalid={orientYInvalid}/>
          </ContainerWithRows>
        </Property>
        <Property label='z'>
          <ContainerWithRows>
            <InputProperty
              invalid={orientZInvalid}
              value={orientRenderInput[2]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setOrientZInvalid,
                    2,
                    currObj.getTransform().getOrientationInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setOrientationInParent
                        .bind(currObj.getTransform()),
                    orientRenderInput,
                    setOrientRenderInput,
                    0,
                    toRadians,
                );
              }}
            />
            <InvalidValueInfo invalid={orientZInvalid}/>
          </ContainerWithRows>
        </Property>
      </CardBody>


      <CardBody title='scale'>
        <Property label='x'>
          <ContainerWithRows>
            <InputProperty
              invalid={scaleXInvalid}
              value={scaleRenderInput[0]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setScaleXInvalid,
                    0,
                    currObj.getTransform().getScaleInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setScaleInParent
                        .bind(currObj.getTransform()),
                    scaleRenderInput,
                    setScaleRenderInput,
                    1,
                );
              }}
            />
            <InvalidValueInfo invalid={scaleXInvalid}/>
          </ContainerWithRows>
        </Property>
        <Property label='y'>
          <ContainerWithRows>
            <InputProperty
              invalid={scaleYInvalid}
              value={scaleRenderInput[1]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setScaleYInvalid,
                    1,
                    currObj.getTransform().getScaleInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setScaleInParent
                        .bind(currObj.getTransform()),
                    scaleRenderInput,
                    setScaleRenderInput,
                    1,
                );
              }}
            />
            <InvalidValueInfo invalid={scaleYInvalid}/>
          </ContainerWithRows>
        </Property>
        <Property label='z'>
          <ContainerWithRows>
            <InputProperty
              invalid={scaleZInvalid}
              value={scaleRenderInput[2]}
              onChange={(e) => {
                changeObjNumberProp(
                    e,
                    setScaleZInvalid,
                    2,
                    currObj.getTransform().getScaleInParent
                        .bind(currObj.getTransform()),
                    currObj.getTransform().setScaleInParent
                        .bind(currObj.getTransform()),
                    scaleRenderInput,
                    setScaleRenderInput,
                    1,
                );
              }}
            />
            <InvalidValueInfo invalid={scaleZInvalid}/>
          </ContainerWithRows>
        </Property>
      </CardBody>

      <CardBodyMainLabel className='mg-t--em mg-b--em'>
        Mesh
      </CardBodyMainLabel>
      <MeshProps/>

      <CardBodyMainLabel className='mg-t--em mg-b--em'>
        Material
      </CardBodyMainLabel>
      <MaterialProps/>
    </PanelBody>
  );
};

export default ObjectTreeNodeWindow;
