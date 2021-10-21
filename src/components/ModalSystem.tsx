import ModalSystemContext from 'contexts/ModalSystemContext';
import React, {useState} from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button,
  ModalProps} from 'reactstrap';
import {StandardReactPropsInt} from 'utils/GUI/Standard';

export interface ModalDataInt {
  header?: string;
  body?: JSX.Element;
  onOk?: ((event: React.MouseEvent<Element, MouseEvent>) =>
    boolean) | undefined;
  onCancel?: ((event: React.MouseEvent<Element, MouseEvent>) =>
    boolean) | undefined;
  onClose?: ((event: React.MouseEvent<Element, MouseEvent>) =>
    boolean) | undefined;
  modalSettings?: ModalProps | undefined;
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
        {...(modalData && modalData.modalSettings ?
          modalData.modalSettings : {})}
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        className={props.className}
        style={props.style}
        returnFocusAfterClose={false}
      >
        <ModalHeader toggle={(e) => {
          let close = true;
          if (modalData && modalData.onClose) close = modalData.onClose(e);
          if (close) setIsOpen(!isOpen);
        }}
        >
          {modalData && modalData.header ? modalData.header : ''}
        </ModalHeader>
        <ModalBody>
          {modalData && modalData.body ? modalData.body : ''}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => {
            let close = true;
            if (modalData && modalData.onOk) close = modalData.onOk(e);
            if (close) setIsOpen(!isOpen);
          }}
          >
            Ok
          </Button>{' '}
          <Button color="secondary" onClick={(e) => {
            let close = true;
            if (modalData && modalData.onCancel) close = modalData.onCancel(e);
            if (close) setIsOpen(!isOpen);
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
