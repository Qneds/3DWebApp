import GLOBAL_COMPONENTS_REFRESH_EVENT from 'utils/RefreshEvent';
import {textToObject3D}
  from 'WebGL/Editor/FileParsers/ObjFormatParsingFunctions';
import Object3D from 'WebGL/Objects/Object3D';
import STATE from 'WebGL/State';

addEventListener('message', (event) => {
  const objList = textToObject3D(event.data.body);
  postMessage(JSON.stringify(objList));
});
