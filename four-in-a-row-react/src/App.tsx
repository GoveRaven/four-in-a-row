import React, { useEffect, useRef } from 'react';
import { global } from './global';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      global.setCanvas(canvasRef.current);
      global.start();
    }
  }, [canvasRef]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const offSetX = e.nativeEvent.offsetX;
    const offSetY = e.nativeEvent.offsetY;
    global?.handleClick(offSetX, offSetY);
  };

  return <canvas id='canvas' ref={canvasRef} onClick={handleCanvasClick} />;
}
