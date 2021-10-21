import ModalSystemContext from 'contexts/ModalSystemContext';
import {Refresher} from 'contexts/RefresherContext';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {MdArrowUpward} from 'react-icons/md';
import {Button, DropdownItem, FormFeedback, FormGroup, FormText, Input,
  Label} from 'reactstrap';
import {GUIButton} from 'utils/GUI/GUIUtils';
import GLOBAL_COMPONENTS_REFRESH_EVENT from 'utils/RefreshEvent';
import {textToObject3D}
  from 'WebGL/Editor/FileParsers/ObjFormatParsingFunctions';
import Object3D from 'WebGL/Objects/Object3D';
import STATE from 'WebGL/State';
import saveFileWorker
  from 'worker-loader!webWorkers/guiWorkers/saveObjectWorker';

const ImportObjButton = (): JSX.Element => {
  const modalSystem = useContext(ModalSystemContext);
  const refresher = useContext(Refresher);
  const [isFileChooserDisplayed, setIsFileChooserDisplayed] = useState(false);

  const [currFile, setCurrFile] = useState<File | null>(null);
  const [invalidInput, setInvalidInput] = useState(true);

  useEffect(() => {
    if (modalSystem?.isOpen && isFileChooserDisplayed) {
      refreshChosenFileModal();
    }
  }, [currFile, modalSystem?.isOpen, isFileChooserDisplayed]);

  useEffect(() => {
    if (isFileChooserDisplayed) {
      setIsFileChooserDisplayed(modalSystem ? modalSystem.isOpen : false);
    }
  }, [modalSystem?.isOpen]);

  const refreshChosenFileModal = () => {
    modalSystem?.setModalData({
      header: 'Import object',
      body: (
        <FormGroup>
          <Input
            type='file'
            name='file'
            accept='.obj'
            onChange={(e) => {
              setCurrFile(e.target.files && e.target.files.length > 0 ?
                e.target.files['0'] : null);
              setInvalidInput(e.target.files && e.target.files.length > 0 ?
                false : true);
            }}
            invalid={invalidInput}
          />
          <FormFeedback className='input-error'>
            File is not chosen
          </FormFeedback>
        </FormGroup>
      ),
      onOk: () => {
        console.log(currFile);
        if (!currFile) {
          return false;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
          // console.log(e && e.target ? e.target.result : 'null');
          if (e && e.target && e.target.result) {
            const fileName = currFile.name;
            /*
            const savingWorker = new Worker(
                new URL('webWorkers/guiWorkers/saveObjectWorker',
                    import.meta.url)
                , {type: 'module'},
            );
            savingWorker.onmessage = (event) => {
              console.log(event.data);
            };
            savingWorker.postMessage('init');
            */

            const objList = textToObject3D(e.target.result as string);
            if (objList.length === 0) return;

            const obj = new Object3D();

            // setName
            const name = fileName.split('.')[0];
            obj.setName(name);

            let parentObj = STATE.getSelectedObject();
            if (!parentObj) {
              parentObj = STATE.getWorld();
            }
            parentObj?.addChild(obj);
            obj.setParent(parentObj);
            objList.forEach((o) => {
              o.setParent(obj);
              obj.addChild(o);
            });
            GLOBAL_COMPONENTS_REFRESH_EVENT.refresh();
          }
        };
        reader.readAsText(currFile);
        return true;
      },
    });
  };

  return (
    <GUIButton
      text='Import OBJ file'
      ico={<MdArrowUpward/>}
      onClick={() => {
        setCurrFile(null);
        setInvalidInput(true);
        modalSystem?.open();
        setIsFileChooserDisplayed(true);
      }}
    />
  );
};

export default ImportObjButton;
