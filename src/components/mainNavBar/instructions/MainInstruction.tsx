import {List} from '@mui/material';
import ModalSystemContext from 'contexts/ModalSystemContext';
import React, {useContext} from 'react';
import {DropdownItem, Form, Label} from 'reactstrap';


const MainInstruction = (): JSX.Element=> {
  const modalSystem = useContext(ModalSystemContext);

  const setUpInstruction = () => {
    modalSystem?.setModalData({
      header: 'Instruction',
      body: <InstructionBody/>,
    });
    modalSystem?.open();
  };

  return (
    <DropdownItem
      onClick={setUpInstruction}
    >
      Instruction
    </DropdownItem>
  );
};

export default MainInstruction;


const InstructionBody = (): JSX.Element => {
  return (
    <Form>
      <h3>Camera</h3>
      <List>
        <p>
          When you hold down C key, the camera is in Orbiting mode,
          where you can change viewing angles by moving around
          mouse while holding left mouse button.
        </p>
        <p>
          When you hold down Shift key,
          the camera is in Flying mode, where you can
          move the camera position by holding down W, A, S, D keys.
        </p>
        <p>
          When holding C key or Shift key you can zoom in
          or zoom out by using mouse scroll
        </p>
      </List>

      <h3>Views</h3>
      <p>
        There is a predefined set of tools for each view.
        There are currently 2 views in the application:
        <ul>
          <li>
            Layout view
          </li>
          <li>
           Edit view
          </li>
        </ul>
      </p>

      <h5>Layout view</h5>
      <p>
        In layout view, you can manipulate position of an object
        in space in relation to other objects. In this view you can also
        select an object, that can be used in other views.
        Objects are selected with the left mouse button.
      </p>
      <h5>Edit view</h5>
      <p>
        In edit view, you can manipulate positions and other properties of
        the vertices, edges and faces of the selected object.
        To switch between editing modes, use the menu
        in upper left corner of the viewport.
      </p>

      <h3>
        Tools
      </h3>
      <p>
        There is a toolbox in the upper left section of the browser.
        In toolbox, you can change selected tool, that
        can be used to manipulate objects. Selected tool is highlighted.
      </p>

      <h3>Tool properties</h3>
      <p>
        There is a tool&apos;s properties window in the bottom
        left section of the browser.
        In this window you can manipulate tool&apos;s properties,
        for example, speed change factor.
        Some properties are global and other are common to given set of tools.
      </p>

      <h3>Navigation tree</h3>
      <p>
        There is a navigation tree window in the
        upper right section of the browser.
        In this window you can manipulate object
        in render queue hierarchy by dragging objects over another object.
        In this window you can an select object
        or you can delete an object.
        Position of object in space is computed relative to its parent.
        For this reason, when you change the tree hierarchy
        some objects may change their position in space.
      </p>

      <h3>Object properties</h3>
      <p>
        There is an object properties window in the
        bottom right section of the browser.
        In this window, you can manipulate object properties such as position.
        Note that presented in this window position,
        orientation and scale are relative to its parent.
      </p>

      <h3>Adding new objects</h3>
      <p>
        To add new object to the scene, you need to open
        <q>Menu</q> drop-down and select <q>Add Object</q>.
        There you can select the type of
        mesh and set its properties such as height.
        To confirm the new object, press <q>Ok</q> button.
        The new object will be added as a child of selected object
        or as a child of root element if no object is selected.
      </p>

      <h3>Importing existing object</h3>
      <p>
        To import an object from a file, click the <q>Import</q> button.
        In the window that appears,
        select the object to be imported, and then confirm.
        The imported object will be added as a child of selected object
        or as a child of root element if no object is selected.
      </p>

      <h3>Exporting object</h3>
      To export an object to a file, open the <q>Export</q>
      drop-down menu and select file extension.
      In the menu that opens, there is an option
      to change the behavior of the export mechanism.
      You can either export one object or export an entire
      subtree of objects into.
      The selected object will be exported or root element
      if no object is selected.

    </Form>
  );
};
