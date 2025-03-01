import {
  IsometricCanvas,
  IsometricGroup,
  IsometricRectangle,
  IsometricRectangleProps,
  PlaneView,
} from "@elchininet/isometric";
import "./App.css";
import { useEffect, useRef } from "react";

type ColorPalette = {
  base: string;
  lightShade: string;
  darkShade: string;
};

function draw(canvas: IsometricCanvas, colorPalette: ColorPalette) {
  function drawCube(x: number, y: number, z: number) {
    const commonProps: Omit<IsometricRectangleProps, "planeView"> = {
      height: 1,
      width: 1,
      strokeColor: colorPalette.darkShade,
      strokeWidth: 6,
      // fillOpacity: 0.5,
    };

    const top = new IsometricRectangle({
      id: "cube-top",
      top: 1,
      fillColor: colorPalette.base,
      planeView: PlaneView.TOP,
      ...commonProps,
    });
    const right = new IsometricRectangle({
      id: "cube-right",
      right: 1,
      fillColor: colorPalette.lightShade,
      planeView: PlaneView.FRONT,
      ...commonProps,
    });
    const left = new IsometricRectangle({
      id: "cube-left",
      left: 1,
      fillColor: colorPalette.darkShade,
      planeView: PlaneView.SIDE,
      ...commonProps,
    });

    const cube = new IsometricGroup({ top: z, right: x, left: y });
    cube.addChildren(top, right, left);

    canvas.addChild(cube);
  }
  // Bottom layer
  drawCube(0, 0, 0);
  drawCube(1, 0, 0);
  drawCube(2, 0, 0);
  //
  drawCube(0, 1, 0);
  drawCube(1, 1, 0);
  drawCube(2, 1, 0);
  //
  drawCube(0, 2, 0);
  drawCube(1, 2, 0);
  drawCube(2, 2, 0);

  // Middle layer
  drawCube(0, 0, 1);
  drawCube(1, 0, 1);
  drawCube(2, 0, 1);
  //
  drawCube(0, 1, 1);
  drawCube(1, 1, 1);
  drawCube(2, 1, 1);
  //
  drawCube(0, 2, 1);
  drawCube(1, 2, 1);
  drawCube(2, 2, 1);

  // Top layer
  drawCube(0, 0, 2);
  drawCube(1, 0, 2);
  drawCube(2, 0, 2);
  //
  drawCube(0, 1, 2);
  drawCube(1, 1, 2);
  drawCube(2, 1, 2);
  //
  drawCube(0, 2, 2);
  drawCube(1, 2, 2);
  drawCube(2, 2, 2);
}

function App() {
  const ref = useRef<HTMLDivElement>(null);

  async function handleClick() {
    if (ref.current) {
      const clipboardItem = new ClipboardItem({
        "text/plain": ref.current.innerHTML,
      });
      await navigator.clipboard.write([clipboardItem]);
    }
  }

  useEffect(() => {
    let canvas: IsometricCanvas | null;

    if (ref.current) {
      canvas = new IsometricCanvas({
        container: ref.current,
        backgroundColor: "#00000000",
        scale: 100,
        width: 800,
        height: 800,
      });

      const monoColorPalette = {
        base: "#FFFFFF",
        lightShade: "#FFFFFF",
        darkShade: "#343434",
      };

      draw(canvas, monoColorPalette);
    }

    return () => {
      canvas?.getElement().remove();
    };
  }, []);

  return (
    <>
      <div id="canvas-wrapper" ref={ref} />
      <button type="button" onClick={handleClick}>
        Save SVG
      </button>
    </>
  );
}

export default App;
