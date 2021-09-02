import React from 'react';
import {useContext, useState, useEffect, useCallback} from 'react';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';
import {useResizeDetector} from 'react-resize-detector';
import WebGLI from 'WebGL/WebGl';
import WebGLCanvasEvent, {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';
import WebGLU from 'WebGL/WebGlUtils';
import ViewManagerInst from 'WebGL/Views/ViewManager';

const Viewport = ({viewId} : {viewId: number}): JSX.Element => {
  const color = useContext(ColorModeContext);

  const {width, height, ref} = useResizeDetector();
  const [canvasEvent, setCanvasEvent] = useState<CanvasEvent | null>(null);


  useEffect(() => {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');
    const canEvent = new CanvasEvent();
    if (!gl) {
      alert('WebGL not initialized properly.');
      return;
    }
    setCanvasEvent(canEvent);
    WebGLI.init(gl, canvas, canEvent);
    WebGLI.intiRenderLoop();
  }, []);
  /*
  useEffect(() => {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      alert('WebGL not initialized properly.');
      return;
    }
    WebGLI.updateContext(gl);
  });
*/
  useEffect(() => {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    if (!canvasEvent) {
      return;
    }
    canvasEvent.triggerOnResize(
        window.scrollY + canvas.getBoundingClientRect().top,
        window.scrollX + canvas.getBoundingClientRect().left,
        canvas.width, canvas.height, 'canvas');
  }, [width, height]);

  /*
  useEffect(() => {
    console.log(canvasElement);
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        ctx.font = '30px Arial';
        ctx.fillRect(60, 60, 60, 60);
      }
    }

    // const gl = canvasElement.getContext('webgl');
  }, [width, height, canvasElement]);
*/
  return (
    <Frame
      backgroundColor={color?.colorMode.backgroundColor}
      borderColor={color?.colorMode.accentColor}
      borderWidth={2}
      style={{
        height: '100%',
      }}>
      <div
        id="canvasFrame"
        ref={ref}
        style={{
          height: '100%',
          width: '100%',
          margin: 0,
          position: 'relative',
        }}
      >
        <div style={{
          zIndex: 2,
          position: 'absolute',
          top: 0,
        }}>
          {ViewManagerInst.returnOnScreenMenu(viewId)}
        </div>
        <canvas
          style={{
            zIndex: 1,
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
          }}
          id="canvas"
          width={width}
          height={height}
        >
        </canvas>
      </div>
    </Frame>
  );
};

Viewport.displayName = 'Viewport';

export default Viewport;
