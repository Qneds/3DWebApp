import React from 'react';
import {useContext, useState, useEffect, useCallback} from 'react';
import Frame from 'utils/Frame';
import ColorModeContext from 'contexts/ColorModeContext';
import {useResizeDetector} from 'react-resize-detector';
import WebGLI from 'WebGL/WebGl';
import WebGLCanvasEvent, {CanvasEvent} from 'WebGL/Listeners/CanvasEvent';

const Viewport = (): JSX.Element => {
  const color = useContext(ColorModeContext);

  const {width, height, ref} = useResizeDetector();
  const [r, rer] = useState(false);
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
    WebGLI.init(gl, canEvent);
    WebGLI.intiRenderLoop();
    rer(!r);
  }, []);

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
        <canvas
          style={{
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

export default Viewport;
