import {
  IsometricGroup,
  IsometricRectangle,
  IsometricRectangleProps,
  PlaneView,
} from "@elchininet/isometric";
import useIsometricCanvas from "./useIsometricCanvas.tsx";
import { randomBetween } from "@std/random/between";
import { useEffect } from "react";
import { convert, hexToRGB, OKLCH, serialize, sRGB } from "@texel/color";

export type ColorPalette = {
  base: string;
  background: string;
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

function createColorPalette(color: string): ColorPalette {
  const baseColorRGB = hexToRGB(color);
  const baseColor = convert(baseColorRGB, sRGB, OKLCH);

  const lightColor = [
    baseColor[0] / 2,
    baseColor[1],
    baseColor[2],
  ];
  const darkColor = [
    baseColor[0] / 3,
    baseColor[1],
    baseColor[2],
  ];
  const backgroundColor = [
    baseColor[0] / 10,
    baseColor[1],
    baseColor[2],
  ];

  return {
    base: serialize(baseColor, OKLCH, sRGB),
    background: serialize(backgroundColor, OKLCH, sRGB),
    lightShade: serialize(lightColor, OKLCH, sRGB),
    darkShade: serialize(darkColor, OKLCH, sRGB),
  };
}

function useCube(
  size: number,
  probability: number,
  color: string,
) {
  const colorPalette = createColorPalette(color);
  const { ref, copySVG, clear, canvas, isReady } = useIsometricCanvas();

  // This is a hack, currently there is no way to update the background
  // color  of the canvas afterwards.
  function drawBackground() {
    const size = 999999;
    const background = new IsometricRectangle({
      height: size,
      width: size,
      top: size / 2,
      fillColor: colorPalette.background,
      planeView: PlaneView.TOP,
    });
    return background;
  }

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
    // Let user remove individual cubes via mouse click.
    cube.addEventListener("click", () => cube.clear());
    return cube;
  }

  function drawCubeGrid() {
    const cubeGrid = new IsometricGroup();

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          if (getRandomBoolean(probability)) {
            cubeGrid.addChild(drawCube(x, y, z));
          }
        }
      }
    }
    return cubeGrid;
  }

  function handleDraw() {
    if (canvas) {
      canvas.clear();
      // This keeps the cube evenly sized.
      canvas.scale = 300 / size;
      canvas.addChild(drawBackground());
      canvas.addChild(drawCubeGrid());
    }
  }

  useEffect(() => {
    if (isReady) handleDraw();
  }, [isReady, probability, size, color]);

  return {
    ref,
    copySVG,
    clear,
    draw: handleDraw,
  };
}

export default useCube;
