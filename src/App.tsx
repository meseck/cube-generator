import {
  IsometricCanvas,
  IsometricGroup,
  IsometricRectangle,
  IsometricRectangleProps,
  PlaneView,
} from "@elchininet/isometric";
import "./App.css";
import Canvas, { ColorPalette } from "./Canvas.tsx";
import { randomBetween } from "@std/random";

function getRandomBoolean(probability: number) {
  if (probability < 0 || probability > 1) {
    throw new Error("Probability must be between 0 and 1");
  }
  // Return true with the given probability, else false
  return randomBetween(0, 1) < probability;
}

function draw(canvas: IsometricCanvas, colorPalette: ColorPalette) {
  const cubeSize = 3;

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

  for (let x = 0; x < cubeSize; x++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let z = 0; z < cubeSize; z++) {
        if (getRandomBoolean(0.8)) {
          drawCube(x, y, z);
        }
      }
    }
  }
}

function App() {
  return (
    <>
      <Canvas draw={draw} />
    </>
  );
}

export default App;
