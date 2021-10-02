import React, {useEffect, useState} from 'react';
import {Form, FormFeedback, FormGroup, Input, Label} from 'reactstrap';
import {CircleBuilder} from 'WebGL/Objects/BasicMeshes/Circle';
import {ConeBuilder} from 'WebGL/Objects/BasicMeshes/Cone';
import {CubeBuilder} from 'WebGL/Objects/BasicMeshes/Cube';
import {CylinderBuilder} from 'WebGL/Objects/BasicMeshes/Cylinder';
import {GeometryBuilder} from 'WebGL/Objects/BasicMeshes/GeometryProvider';
import {TorusBuilder} from 'WebGL/Objects/BasicMeshes/Torus';

const CIRCLE_BUILDER = new CircleBuilder();
const CONE_BUILDER = new ConeBuilder();
const CUBE_BUILDER = new CubeBuilder();
const CYLINDER_BUILDER = new CylinderBuilder();
const TORUS_BUILDER = new TorusBuilder();

type SignalGlobalErrorProp = {
  markError: React.Dispatch<React.SetStateAction<boolean>>;
};

type SelectCurrentBuilderProp = {
  currentBuilderRef:
    React.MutableRefObject<GeometryBuilder | null | undefined>;
}
/**
 * extract value from sting
 * @param {string} value
 * @param {React.Dispatch<React.SetStateAction<boolean>>} signalErr
 * @param {React.Dispatch<React.SetStateAction<string>>} setErrMsg
 * @return {number | undefined}
 */
function extractValue(
    value: string,
    signalErr: React.Dispatch<React.SetStateAction<boolean>>,
    setErrMsg: React.Dispatch<React.SetStateAction<string>>,
): number | undefined {
  const valueNum = parseFloat(value);
  if (isNaN(valueNum)) {
    signalErr(true);
    setErrMsg('Value is not a number');
    return undefined;
  }
  return valueNum;
}

interface InputElementProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid: boolean
  msgIfInvalid: boolean
}

const InputElement = (props: InputElementProps): JSX.Element => {
  return (
    <FormGroup>
      <Label>
        {props.label}
      </Label>
      <Input
        value={props.value}
        onChange={props.onChange}
        invalid={props.isInvalid}
      />
      <FormFeedback>
        {props.msgIfInvalid}
      </FormFeedback>
    </FormGroup>
  );
};

const AddObjectModal =
(props: SignalGlobalErrorProp & SelectCurrentBuilderProp):
JSX.Element => {
  const [selectedMesh, setSelectedMesh] = useState('None');

  const renderBuilderProperties = (): JSX.Element => {
    switch (selectedMesh) {
      case 'Circle': {
        props.currentBuilderRef.current =
          CIRCLE_BUILDER ? CIRCLE_BUILDER : undefined;
        return <CircleMeshProperties markError={props.markError} />;
      }
      case 'Cone': {
        props.currentBuilderRef.current =
          CONE_BUILDER ? CONE_BUILDER : undefined;
        return <div/>;
      }
      case 'Cube': {
        props.currentBuilderRef.current =
          CUBE_BUILDER ? CUBE_BUILDER : undefined;
        return <div/>;
      }
      case 'Cylinder': {
        props.currentBuilderRef.current =
          CYLINDER_BUILDER ? CYLINDER_BUILDER : undefined;
        return <div/>;
      }
      case 'Torus': {
        props.currentBuilderRef.current =
          TORUS_BUILDER ? TORUS_BUILDER : undefined;
        return <div/>;
      }
      default: {
        props.currentBuilderRef.current = null;
        return (<></>);
      }
    }
  };

  return (
    <div>
      <Form>
        <FormGroup>
          <Label>
            Choose basic mesh
          </Label>
          <Input
            type='select'
            name='select'
            value={selectedMesh}
            onChange={(e) => setSelectedMesh(e.target.value)}
          >
            <option>None</option>
            <option>Circle</option>
            <option>Cone</option>
            <option>Cube</option>
            <option>Cylinder</option>
            <option>Torus</option>
          </Input>
        </FormGroup>
        {
          renderBuilderProperties()
        }
      </Form>
    </div>
  );
};

export default AddObjectModal;

const CircleMeshProperties = (props: SignalGlobalErrorProp): JSX.Element => {
  const initInnRadius = 1;
  const initOutRadius = 2;
  const initRadialSeg = 4;
  const gt0ErrMsg = 'Value must be greater than 0';

  const [innerRadius, setInnerRadius] = useState(initInnRadius + '');
  const [isInnerRadiusInvalid, setIsInnerRadiusInvalid] = useState(false);
  const [invalidMessageInnRad, setInvalidMessageInnRad] = useState('');

  const [outerRadius, setOuterRadius] = useState(initOutRadius + '');
  const [isOuterRadiusInvalid, setIsOuterRadiusInvalid] = useState(false);
  const [invalidMessageOutRad, setInvalidMessageOutRad] = useState('');

  const [numOfRadSeg, setNumOfRadSeg] = useState(initRadialSeg + '');
  const [isNumOfRadSegInvalid, setIsNumOfRadSegInvalid] = useState(false);
  const [invalidMessageNumRad, setInvalidMessageNumRad] = useState('');

  useEffect(() => {
    CIRCLE_BUILDER.setInnerRadius(initInnRadius).setOuterRadius(initOutRadius).
        setRadialSegments(initRadialSeg);
    props.markError(false);
  }, []);

  useEffect(() => {
    props.markError(
        isInnerRadiusInvalid ||
        isOuterRadiusInvalid ||
        isNumOfRadSegInvalid,
    );
  }, [isInnerRadiusInvalid, isOuterRadiusInvalid, isNumOfRadSegInvalid]);

  const handleInnerRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInnerRadiusInvalid(false);
    setInnerRadius(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsInnerRadiusInvalid, setInvalidMessageInnRad);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CIRCLE_BUILDER.setInnerRadius(fValue);
      } else {
        setIsInnerRadiusInvalid(true);
        setInvalidMessageInnRad(gt0ErrMsg);
      }
    }
  };

  const handleOuterRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOuterRadiusInvalid(false);
    setOuterRadius(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsOuterRadiusInvalid, setInvalidMessageOutRad);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CIRCLE_BUILDER.setOuterRadius(fValue);
      } else {
        setIsOuterRadiusInvalid(true);
        setInvalidMessageOutRad(gt0ErrMsg);
      }
    }
  };

  const handleRadialSegments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNumOfRadSegInvalid(false);
    setNumOfRadSeg(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsNumOfRadSegInvalid, setInvalidMessageNumRad);

    if (fValue !== undefined) {
      if (fValue > 0) {
        if (Number.isInteger(fValue)) {
          CIRCLE_BUILDER.setRadialSegments(fValue);
        } else {
          setIsNumOfRadSegInvalid(true);
          setInvalidMessageNumRad('Provided value is not an integer');
        }
      } else {
        setIsNumOfRadSegInvalid(true);
        setInvalidMessageNumRad(gt0ErrMsg);
      }
    }
  };

  return (
    <>
      <FormGroup>
        <Label>
          Inner radius
        </Label>
        <Input
          value={innerRadius}
          onChange={handleInnerRadius}
          invalid={isInnerRadiusInvalid}
        />
        <FormFeedback>
          {invalidMessageInnRad}
        </FormFeedback>
      </FormGroup>

      <FormGroup>
        <Label>
          Outer radius
        </Label>
        <Input
          value={outerRadius}
          onChange={handleOuterRadius}
          invalid={isOuterRadiusInvalid}
        />
        <FormFeedback>
          {invalidMessageOutRad}
        </FormFeedback>
      </FormGroup>

      <FormGroup>
        <Label>
          Number of radial segments
        </Label>
        <Input
          value={numOfRadSeg}
          onChange={handleRadialSegments}
          invalid={isNumOfRadSegInvalid}
        />
        <FormFeedback>
          {invalidMessageNumRad}
        </FormFeedback>
      </FormGroup>

    </>
  );
};

const ConeMeshProperties = (props: SignalGlobalErrorProp): JSX.Element => {
  const initHeight = 2;
  const initHeightSegments = 1;
  const initRadialSegments = 4;
  const initBaseRadius = 1;
  const gt0ErrMsg = 'Value must be greater than 0';

  const [height, setHeight] = useState(initHeight + '');
  const [isHeightInvalid, setIsHeightInvalid] = useState(false);
  const [invalidMessageHeight, setInvalidMessageHeight] = useState('');

  const [heightSegments, setHeightSegments] = useState(initHeightSegments + '');
  const [isHeightSegmentsInvalid, setHeightSegmentsInvalid] = useState(false);
  const [invalidMessageHeightSegments, setInvalidMessageHeightSegments] =
    useState('');

  const [numOfRadSeg, setNumOfRadSeg] = useState(initRadialSegments + '');
  const [isNumOfRadSegInvalid, setIsNumOfRadSegInvalid] = useState(false);
  const [invalidMessageNumRad, setInvalidMessageNumRad] = useState('');

  const [baseRadius, setBaseRadius] = useState(initBaseRadius + '');
  const [isBaseRadiusInvalid, setBaseRadiusInvalid] = useState(false);
  const [invalidMessageBaseRadius, setInvalidMessageBaseRadius] =
    useState('');

  useEffect(() => {
    CONE_BUILDER.setHeight(initHeight).setHeightSegments(initHeightSegments).
        setRadialSegments(initRadialSegments).setRadius(initBaseRadius);
    props.markError(false);
  }, []);
};
