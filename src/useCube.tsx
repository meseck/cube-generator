import {
  IsometricGroup,
  IsometricRectangle,
  IsometricRectangleProps,
  PlaneView,
} from "@elchininet/isometric";
import useIsometricCanvas from "./useIsometricCanvas.tsx";
import { randomBetween } from "@std/random/between";
import { useEffect } from "react";

export type ColorPalette = {
  base: string;
  lightShade: string;
  darkShade: string;
};

function getRandomBoolean(probability: number) {
  if (probability < 0 || probability > 1) {
    throw new Error("Probability must be between 0 and 1");
  }
  // Return true with the given probability, else false
  return randomBetween(0, 1) < probability;
}

function useCube(
  size: number,
  probability: number,
  baseColor: string,
) {
  const { ref, saveSVG, clear, canvas, isReady } = useIsometricCanvas();

  const colorPalette = {
    base: baseColor,
    lightShade: "#FFFFFF",
    darkShade: "#343434",
  };

  function drawCube(x: number, y: number, z: number) {
    const commonProps: Omit<IsometricRectangleProps, "planeView"> = {
      height: 1,
      width: 1,
      strokeColor: colorPalette.darkShade,
      strokeWidth: 6,
      // fillOpacity: 0.5,
    };

    const top = new IsometricRectangle({
      top: 1,
      fillColor: colorPalette.base,
      planeView: PlaneView.TOP,
      ...commonProps,
    });
    const right = new IsometricRectangle({
      right: 1,
      fillColor: colorPalette.lightShade,
      planeView: PlaneView.FRONT,
      ...commonProps,
    });
    const left = new IsometricRectangle({
      left: 1,
      fillColor: colorPalette.darkShade,
      planeView: PlaneView.SIDE,
      ...commonProps,
    });

    const cube = new IsometricGroup({ top: z, right: x, left: y });
    cube.addChildren(top, right, left);
    // Let user remove individual cubes via mouse click
    cube.addEventListener("click", () => cube.clear());
    return cube;
  }

  function drawCubeGrid() {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          if (getRandomBoolean(probability)) {
            canvas?.addChild(drawCube(x, y, z));
          }
        }
      }
    }
  }

  function handleDraw() {
    if (canvas) {
      canvas.clear();
      // This keeps the cube evenly sized
      canvas.scale = 300 / size;
      drawCubeGrid();
    }
  }

  useEffect(() => {
    if (isReady) handleDraw();
  }, [isReady, probability, size, baseColor]);

  return {
    ref,
    saveSVG,
    clear,
    draw: handleDraw,
  };
}

export default useCube;
