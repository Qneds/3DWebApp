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

const gt0ErrMsg = 'Value must be greater than 0';
const notIntErrMsg = 'Provided value is not an integer';

type SignalGlobalErrorProp = {
  markError: (e: boolean) => void;
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
    signalErr: (e: boolean) => void,
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
  isInvalid: boolean;
  msgIfInvalid: string;
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
        return <CircleMeshProperties markError={props.markError}/>;
      }
      case 'Cone': {
        props.currentBuilderRef.current =
          CONE_BUILDER ? CONE_BUILDER : undefined;
        return <ConeMeshProperties markError={props.markError}/>;
      }
      case 'Cube': {
        props.currentBuilderRef.current =
          CUBE_BUILDER ? CUBE_BUILDER : undefined;
        return <CubeMeshProperties markError={props.markError}/>;
      }
      case 'Cylinder': {
        props.currentBuilderRef.current =
          CYLINDER_BUILDER ? CYLINDER_BUILDER : undefined;
        return <CylinderMeshProperties markError={props.markError}/>;
      }
      case 'Torus': {
        props.currentBuilderRef.current =
          TORUS_BUILDER ? TORUS_BUILDER : undefined;
        return <TorusMeshProperties markError={props.markError}/>;
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
          setInvalidMessageNumRad(notIntErrMsg);
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

  useEffect(() => {
    props.markError(
        isHeightInvalid ||
        isHeightSegmentsInvalid ||
        isBaseRadiusInvalid ||
        isNumOfRadSegInvalid,
    );
  }, [isHeightInvalid, isHeightSegmentsInvalid,
    isNumOfRadSegInvalid, isBaseRadiusInvalid]);

  const handleHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsHeightInvalid(false);
    setHeight(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsHeightInvalid, setInvalidMessageHeight);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CONE_BUILDER.setHeight(fValue);
      } else {
        setIsHeightInvalid(true);
        setInvalidMessageHeight(gt0ErrMsg);
      }
    }
  };

  const handleHeightSegments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeightSegmentsInvalid(false);
    setHeightSegments(event.target.value);
    const fValue = extractValue(event.target.value,
        setHeightSegmentsInvalid, setInvalidMessageHeightSegments);

    if (fValue !== undefined) {
      if (fValue > 0) {
        if (Number.isInteger(fValue)) {
          CONE_BUILDER.setHeightSegments(fValue);
        } else {
          setHeightSegmentsInvalid(true);
          setInvalidMessageHeightSegments(notIntErrMsg);
        }
      } else {
        setHeightSegmentsInvalid(true);
        setInvalidMessageHeightSegments(gt0ErrMsg);
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
          CONE_BUILDER.setRadialSegments(fValue);
        } else {
          setIsNumOfRadSegInvalid(true);
          setInvalidMessageNumRad(notIntErrMsg);
        }
      } else {
        setIsNumOfRadSegInvalid(true);
        setInvalidMessageNumRad(gt0ErrMsg);
      }
    }
  };

  const handleRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseRadiusInvalid(false);
    setBaseRadius(event.target.value);
    const fValue = extractValue(event.target.value,
        setBaseRadiusInvalid, setInvalidMessageBaseRadius);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CONE_BUILDER.setRadius(fValue);
      } else {
        setBaseRadiusInvalid(true);
        setInvalidMessageBaseRadius(gt0ErrMsg);
      }
    }
  };

  return (
    <>
      <InputElement
        label={'Height'}
        value={height}
        onChange={handleHeight}
        isInvalid={isHeightInvalid}
        msgIfInvalid={invalidMessageHeight}
      />
      <InputElement
        label={'Number of height segments'}
        value={heightSegments}
        onChange={handleHeightSegments}
        isInvalid={isHeightSegmentsInvalid}
        msgIfInvalid={invalidMessageHeightSegments}
      />
      <InputElement
        label={'Radius'}
        value={baseRadius}
        onChange={handleRadius}
        isInvalid={isBaseRadiusInvalid}
        msgIfInvalid={invalidMessageBaseRadius}
      />
      <InputElement
        label={'Number of radial segments'}
        value={numOfRadSeg}
        onChange={handleRadialSegments}
        isInvalid={isNumOfRadSegInvalid}
        msgIfInvalid={invalidMessageNumRad}
      />
    </>
  );
};


const CubeMeshProperties = (props: SignalGlobalErrorProp): JSX.Element => {
  const initXHalf = 1;
  const initYHalf = 1;
  const initZHalf = 1;

  const [xHalfWidth, setXHalfWidth] = useState(initXHalf + '');
  const [isXHalfWidthInvalid, setIsXHalfWidthInvalid] = useState(false);
  const [invalidMessageXHalfWidth, setInvalidMessageXHalfWidth] = useState('');

  const [yHalfWidth, setYHalfWidth] = useState(initYHalf + '');
  const [isYHalfWidthInvalid, setIsYHalfWidthInvalid] = useState(false);
  const [invalidMessageYHalfWidth, setInvalidMessageYHalfWidth] = useState('');

  const [zHalfWidth, setZHalfWidth] = useState(initZHalf + '');
  const [isZHalfWidthInvalid, setIsZHalfWidthInvalid] = useState(false);
  const [invalidMessageZHalfWidth, setInvalidMessageZHalfWidth] = useState('');

  useEffect(() => {
    CUBE_BUILDER.setXHalfWidth(initXHalf)
        .setYHalfWidth(initYHalf).setZHalfWidth(initZHalf);
    props.markError(false);
  }, []);

  useEffect(() => {
    props.markError(
        isXHalfWidthInvalid ||
        isYHalfWidthInvalid ||
        isZHalfWidthInvalid,
    );
  }, [isXHalfWidthInvalid, isYHalfWidthInvalid,
    isZHalfWidthInvalid]);

  const handleXHalfWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsXHalfWidthInvalid(false);
    setXHalfWidth(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsXHalfWidthInvalid, setInvalidMessageXHalfWidth);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CUBE_BUILDER.setXHalfWidth(fValue);
      } else {
        setIsXHalfWidthInvalid(true);
        setInvalidMessageXHalfWidth(gt0ErrMsg);
      }
    }
  };

  const handleYHalfWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsYHalfWidthInvalid(false);
    setYHalfWidth(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsYHalfWidthInvalid, setInvalidMessageYHalfWidth);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CUBE_BUILDER.setYHalfWidth(fValue);
      } else {
        setIsYHalfWidthInvalid(true);
        setInvalidMessageYHalfWidth(gt0ErrMsg);
      }
    }
  };

  const handleZHalfWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsZHalfWidthInvalid(false);
    setZHalfWidth(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsZHalfWidthInvalid, setInvalidMessageZHalfWidth);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CUBE_BUILDER.setZHalfWidth(fValue);
      } else {
        setIsZHalfWidthInvalid(true);
        setInvalidMessageZHalfWidth(gt0ErrMsg);
      }
    }
  };

  return (
    <>
      <InputElement
        label={'Distance from center to X side'}
        value={xHalfWidth}
        onChange={handleXHalfWidth}
        isInvalid={isXHalfWidthInvalid}
        msgIfInvalid={invalidMessageXHalfWidth}
      />
      <InputElement
        label={'Distance from center to Y side'}
        value={yHalfWidth}
        onChange={handleYHalfWidth}
        isInvalid={isYHalfWidthInvalid}
        msgIfInvalid={invalidMessageYHalfWidth}
      />
      <InputElement
        label={'Distance from center to Z side'}
        value={zHalfWidth}
        onChange={handleZHalfWidth}
        isInvalid={isZHalfWidthInvalid}
        msgIfInvalid={invalidMessageZHalfWidth}
      />
    </>
  );
};

const CylinderMeshProperties = (props: SignalGlobalErrorProp): JSX.Element => {
  const initHeight = 2;
  const initHeightSegments = 1;
  const initRadialSegments = 4;
  const initRadiusTop = 1;
  const initRadiusBottom = 1;
  const initIsOpenEnded = false;

  const [height, setHeight] = useState(initHeight + '');
  const [isHeightInvalid, setIsHeightInvalid] = useState(false);
  const [invalidMessageHeight, setInvalidMessageHeight] = useState('');

  const [heightSegments, setHeightSegments] = useState(initHeightSegments + '');
  const [isHeightSegmentsInvalid, setIsHeightSegmentsInvalid] = useState(false);
  const [invalidMessageHeightSegments, setInvalidMessageHeightSegments] =
    useState('');

  const [radialSegments, setRadialSegments] = useState(initRadialSegments + '');
  const [isRadialSegmentsInvalid, setIsRadialSegmentsInvalid] = useState(false);
  const [invalidMessageRadialSegments, setInvalidMessageRadialSegments] =
    useState('');

  const [radiusTop, setRadiusTop] = useState(initRadiusTop + '');
  const [isRadiusTopInvalid, setIsRadiusTopInvalid] = useState(false);
  const [invalidMessageRadiusTop, setInvalidMessageRadiusTop] =
      useState('');

  const [radiusBottom, setRadiusBottom] = useState(initRadiusBottom + '');
  const [isRadiusBottomInvalid, setIsRadiusBottomInvalid] = useState(false);
  const [invalidMessageRadiusBottom, setInvalidMessageRadiusBottom] =
          useState('');

  const [isOpenEnded, setIsOpenEnded] = useState(initIsOpenEnded);

  useEffect(() => {
    CYLINDER_BUILDER.setHeight(initHeight).setHeightSegments(initHeightSegments)
        .setRadialSegments(initRadialSegments).setRadiusBottom(initRadiusBottom)
        .setRadiusTop(initRadiusTop).setOpenEnded(initIsOpenEnded);
    props.markError(false);
  }, []);

  useEffect(() => {
    props.markError(
        isHeightInvalid ||
        isHeightSegmentsInvalid ||
        isRadialSegmentsInvalid ||
        isRadiusTopInvalid ||
        isRadiusBottomInvalid,
    );
  }, [isHeightInvalid, isHeightSegmentsInvalid, isRadiusBottomInvalid,
    isRadialSegmentsInvalid, isRadiusTopInvalid]);

  const handleHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsHeightInvalid(false);
    setHeight(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsHeightInvalid, setInvalidMessageHeight);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CYLINDER_BUILDER.setHeight(fValue);
      } else {
        setIsHeightInvalid(true);
        setInvalidMessageHeight(gt0ErrMsg);
      }
    }
  };

  const handleHeightSegments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsHeightSegmentsInvalid(false);
    setHeightSegments(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsHeightSegmentsInvalid, setInvalidMessageHeightSegments);

    if (fValue !== undefined) {
      if (fValue > 0) {
        if (Number.isInteger(fValue)) {
          CYLINDER_BUILDER.setHeightSegments(fValue);
        } else {
          setIsHeightSegmentsInvalid(true);
          setInvalidMessageHeightSegments(notIntErrMsg);
        }
      } else {
        setIsHeightSegmentsInvalid(true);
        setInvalidMessageHeightSegments(gt0ErrMsg);
      }
    }
  };

  const handleRadialSegments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadialSegmentsInvalid(false);
    setRadialSegments(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsRadialSegmentsInvalid, setInvalidMessageRadialSegments);

    if (fValue !== undefined) {
      if (fValue > 0) {
        if (Number.isInteger(fValue)) {
          CYLINDER_BUILDER.setRadialSegments(fValue);
        } else {
          setIsRadialSegmentsInvalid(true);
          setInvalidMessageRadialSegments(notIntErrMsg);
        }
      } else {
        setIsRadialSegmentsInvalid(true);
        setInvalidMessageRadialSegments(gt0ErrMsg);
      }
    }
  };

  const handleRadiusTop = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadiusTopInvalid(false);
    setRadiusTop(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsRadiusTopInvalid, setInvalidMessageRadiusTop);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CYLINDER_BUILDER.setRadiusTop(fValue);
      } else {
        setIsRadiusTopInvalid(true);
        setInvalidMessageRadiusTop(gt0ErrMsg);
      }
    }
  };

  const handleRadiusBottom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadiusBottomInvalid(false);
    setRadiusBottom(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsRadiusBottomInvalid, setInvalidMessageRadiusBottom);

    if (fValue !== undefined) {
      if (fValue > 0) {
        CYLINDER_BUILDER.setRadiusBottom(fValue);
      } else {
        setIsRadiusBottomInvalid(true);
        setInvalidMessageRadiusBottom(gt0ErrMsg);
      }
    }
  };

  const handleOpenEnded = () => {
    setIsOpenEnded(!isOpenEnded);
    CYLINDER_BUILDER.setOpenEnded(!isOpenEnded);
  };

  return (
    <>
      <InputElement
        label={'Height'}
        value={height}
        onChange={handleHeight}
        isInvalid={isHeightInvalid}
        msgIfInvalid={invalidMessageHeight}
      />
      <InputElement
        label={'Number of height segments'}
        value={heightSegments}
        onChange={handleHeightSegments}
        isInvalid={isHeightSegmentsInvalid}
        msgIfInvalid={invalidMessageHeightSegments}
      />
      <InputElement
        label={'Number of radial segments'}
        value={radialSegments}
        onChange={handleRadialSegments}
        isInvalid={isRadialSegmentsInvalid}
        msgIfInvalid={invalidMessageRadialSegments}
      />
      <InputElement
        label={'Radius at the top'}
        value={radiusTop}
        onChange={handleRadiusTop}
        isInvalid={isRadiusTopInvalid}
        msgIfInvalid={invalidMessageRadiusTop}
      />
      <InputElement
        label={'Radius at the bottom'}
        value={radiusBottom}
        onChange={handleRadiusBottom}
        isInvalid={isRadiusBottomInvalid}
        msgIfInvalid={invalidMessageRadiusBottom}
      />

      <FormGroup>
        <Label>
          Open cylinder
        </Label>
        <Input
          type='checkbox'
          checked={isOpenEnded}
          onChange={handleOpenEnded}
        />
      </FormGroup>
    </>
  );
};

const TorusMeshProperties = (props: SignalGlobalErrorProp): JSX.Element => {
  const initRadius= 2;
  const initTubeRadius = 0.5;
  const initRadialSegments = 4;
  const initTubularSegments = 8;

  const [radius, setRadius] = useState(initRadius + '');
  const [isRadiusInvalid, setIsRadiusInvalid] = useState(false);
  const [invalidMessageRadius, setInvalidMessageRadius] = useState('');

  const [tubeRadius, setTubeRadius] = useState(initTubeRadius + '');
  const [isTubeRadiusInvalid, setIsTubeRadiusInvalid] = useState(false);
  const [invalidMessageTubeRadius, setInvalidMessageTubeRadius] = useState('');

  const [radialSegments, setRadialSegments] = useState(initRadialSegments + '');
  const [isRadialSegmentsInvalid, setIsRadialSegmentsInvalid] = useState(false);
  const [invalidMessageRadialSegments, setInvalidMessageRadialSegments] =
    useState('');

  const [tubularSegments, setTubularSegments] =
    useState(initTubularSegments + '');
  const [isTubularSegmentsInvalid, setIsTubularSegmentsInvalid] =
    useState(false);
  const [invalidMessageTubularSegments, setInvalidMessageTubularSegments] =
    useState('');


  useEffect(() => {
    TORUS_BUILDER.setRadius(initRadius).setTube(initTubeRadius)
        .setRadialSegments(initRadialSegments)
        .setTubularSegments(initTubularSegments);
    props.markError(false);
  }, []);

  useEffect(() => {
    props.markError(
        isRadiusInvalid ||
        isTubeRadiusInvalid ||
        isRadialSegmentsInvalid ||
        isTubularSegmentsInvalid,
    );
  }, [isRadiusInvalid, isTubeRadiusInvalid, isTubularSegmentsInvalid,
    isRadialSegmentsInvalid]);

  const handleRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadiusInvalid(false);
    setRadius(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsRadiusInvalid, setInvalidMessageRadius);

    if (fValue !== undefined) {
      if (fValue > 0) {
        TORUS_BUILDER.setRadius(fValue);
      } else {
        setIsRadiusInvalid(true);
        setInvalidMessageRadius(gt0ErrMsg);
      }
    }
  };

  const handleTubeRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTubeRadiusInvalid(false);
    setTubeRadius(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsTubeRadiusInvalid, setInvalidMessageTubeRadius);

    if (fValue !== undefined) {
      if (fValue > 0) {
        TORUS_BUILDER.setTube(fValue);
      } else {
        setIsTubeRadiusInvalid(true);
        setInvalidMessageTubeRadius(gt0ErrMsg);
      }
    }
  };

  const handleRadialSegments = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRadialSegmentsInvalid(false);
    setRadialSegments(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsRadialSegmentsInvalid, setInvalidMessageRadialSegments);

    if (fValue !== undefined) {
      if (fValue > 0) {
        if (Number.isInteger(fValue)) {
          TORUS_BUILDER.setRadialSegments(fValue);
        } else {
          setIsRadialSegmentsInvalid(true);
          setInvalidMessageRadialSegments(notIntErrMsg);
        }
      } else {
        setIsRadialSegmentsInvalid(true);
        setInvalidMessageRadialSegments(gt0ErrMsg);
      }
    }
  };

  const handleTubularSegments =
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTubularSegmentsInvalid(false);
    setTubularSegments(event.target.value);
    const fValue = extractValue(event.target.value,
        setIsTubularSegmentsInvalid, setInvalidMessageTubularSegments);

    if (fValue !== undefined) {
      if (fValue > 0) {
        if (Number.isInteger(fValue)) {
          TORUS_BUILDER.setTubularSegments(fValue);
        } else {
          setIsTubularSegmentsInvalid(true);
          setInvalidMessageTubularSegments(notIntErrMsg);
        }
      } else {
        setIsTubularSegmentsInvalid(true);
        setInvalidMessageTubularSegments(gt0ErrMsg);
      }
    }
  };

  return (
    <>
      <InputElement
        label={'Torus radius'}
        value={radius}
        onChange={handleRadius}
        isInvalid={isRadiusInvalid}
        msgIfInvalid={invalidMessageRadius}
      />
      <InputElement
        label={'Tube radius'}
        value={tubeRadius}
        onChange={handleTubeRadius}
        isInvalid={isTubeRadiusInvalid}
        msgIfInvalid={invalidMessageTubeRadius}
      />
      <InputElement
        label={'Number of radial segments'}
        value={radialSegments}
        onChange={handleRadialSegments}
        isInvalid={isRadialSegmentsInvalid}
        msgIfInvalid={invalidMessageRadialSegments}
      />
      <InputElement
        label={'Number of tubular segments'}
        value={tubularSegments}
        onChange={handleTubularSegments}
        isInvalid={isTubularSegmentsInvalid}
        msgIfInvalid={invalidMessageTubularSegments}
      />
    </>
  );
};
