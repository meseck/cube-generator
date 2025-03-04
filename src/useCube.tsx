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

export type Shape = "symmetric" | "asymmetric";

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
  shape: Shape,
  color: string,
  probability: number,
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

  function createMirroredCube<T>(size: number, pattern: boolean[][]) {
    const cube: boolean[][][] = new Array(size);

    for (let x = 0; x < size; x++) {
      cube[x] = new Array(size);
      for (let y = 0; y < size; y++) {
        cube[x][y] = new Array(size);
        for (let z = 0; z < size; z++) {
          // Determine the mirrored indices
          const mirroredX = size - 1 - x;
          const mirroredY = size - 1 - y;
          const mirroredZ = size - 1 - z;

          if (x === 0) {
            cube[x][y][z] = pattern[mirroredY][mirroredZ];
          } else if (x === size - 1) {
            cube[x][y][z] = pattern[y][z];
          } else if (y === 0) {
            cube[x][y][z] = pattern[mirroredX][mirroredZ];
          } else if (y === size - 1) {
            cube[x][y][z] = pattern[x][z];
          } else if (z === 0) {
            cube[x][y][z] = pattern[mirroredX][mirroredY];
          } else if (z === size - 1) {
            cube[x][y][z] = pattern[x][y];
            // Inner part
          } else {
            // Keep the inner part empty
            // cube[x][y][z] = false;

            // Fill with the same pattern
            cube[x][y][z] = pattern[x][y];
          }
        }
      }
    }

    return cube;
  }

  function _createTestPattern(size: number): boolean[][] {
    let flag = true;
    const pattern = Array.from(
      { length: size },
      () =>
        Array.from({ length: size }, () => {
          flag = !flag;
          return flag;
        }),
    );
    return pattern;
  }

  function createRandomSymmetricPattern(size: number) {
    if (size <= 0) {
      throw new Error("Size must be a positive integer.");
    }
    if (size < 3) {
      throw new Error("Size must be at least 3");
    }
    if (size % 2 === 0) {
      throw new Error("Size must be an odd number");
    }

    const pattern: boolean[][] = Array.from(
      { length: size },
      () => Array(size).fill(false),
    );

    for (let i = 0; i < Math.ceil(size / 2); i++) {
      for (let j = 0; j < Math.ceil(size / 2); j++) {
        const randomValue = getRandomBoolean(probability);
        pattern[i][j] = randomValue;
        pattern[j][i] = randomValue;
        pattern[size - i - 1][j] = randomValue;
        pattern[j][size - i - 1] = randomValue;
        pattern[i][size - j - 1] = randomValue;
        pattern[size - j - 1][i] = randomValue;
        pattern[size - i - 1][size - j - 1] = randomValue;
        pattern[size - j - 1][size - i - 1] = randomValue;
      }
    }

    const allTrue = pattern.every((row) => row.every((cell) => cell === true));
    const allFalse = pattern.every((row) =>
      row.every((cell) => cell === false)
    );

    // If the pattern is all true or all false, regenerate
    if (allTrue || allFalse) {
      return createRandomSymmetricPattern(size);
    }

    return pattern;
  }

  function drawAsymmetricCubeGrid() {
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

  function drawSymmetricCubeGrid() {
    const cubeGrid = new IsometricGroup();
    // const pattern = createRandomPattern(size);
    const pattern = createRandomSymmetricPattern(size);
    const mirroredCube = createMirroredCube(size, pattern);

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          if (mirroredCube[x][y][z]) {
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

      if (shape === "symmetric") {
        canvas.addChild(drawSymmetricCubeGrid());
      } else {
        canvas.addChild(drawAsymmetricCubeGrid());
      }
    }
  }

  useEffect(() => {
    if (isReady) handleDraw();
  }, [isReady, shape, size, color, probability]);

  return {
    ref,
    copySVG,
    clear,
    draw: handleDraw,
  };
}

export default useCube;
