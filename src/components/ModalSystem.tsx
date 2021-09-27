import ModalSystemContext from 'contexts/ModalSystemContext';
import React, {useState} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import {StandardReactPropsInt} from 'utils/GUI/Standard';

export interface ModalDataInt {
  header?: string;
  body?: JSX.Element;
  onOk?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onCancel?: React.MouseEventHandler<HTMLButtonElement> | undefined
  onClose?: React.MouseEventHandler<any> | undefined
}

const ModalSystem = (props: StandardReactPropsInt): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalDataInt | null>(null);
  return (
    <ModalSystemContext.Provider value={{
      open: () => setIsOpen(true),
      setModalData: setModalData,
      isOpen: isOpen,
    }}>
      <Modal
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        className={props.className}
        style={props.style}
      >
        <ModalHeader toggle={(e) => {
          if (modalData && modalData.onClose) modalData.onClose(e);
          setIsOpen(!isOpen);
        }}
        >
          {modalData && modalData.header ? modalData.header : ''}
        </ModalHeader>
        <ModalBody>
          {modalData && modalData.body ? modalData.body : ''}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => {
            if (modalData && modalData.onOk) modalData.onOk(e);
            setIsOpen(!isOpen);
          }}
          >
            Ok
          </Button>{' '}
          <Button color="secondary" onClick={(e) => {
            if (modalData && modalData.onCancel) modalData.onCancel(e);
            setIsOpen(!isOpen);
          }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {props.children}
    </ModalSystemContext.Provider>
  );
};

export default ModalSystem;
