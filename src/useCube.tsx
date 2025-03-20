import {
  type IsometricCanvas,
  IsometricGroup,
  IsometricRectangle,
  type IsometricRectangleProps,
  PlaneView,
} from "@elchininet/isometric";
import useIsometricCanvas from "./useIsometricCanvas.tsx";
import { type ChangeEvent, useState } from "react";
import { convert, hexToRGB, OKLCH, serialize, sRGB } from "@texel/color";

export type Shape = "symmetric" | "asymmetric";

export type ColorPalette = {
  base: string;
  background: string;
  lightShade: string;
  darkShade: string;
};

function createColorPalette(color: string): ColorPalette {
  const baseColorRGB = hexToRGB(color);
  const baseColor = convert(baseColorRGB, sRGB, OKLCH);

  const lightColor = [baseColor[0] / 2, baseColor[1], baseColor[2]];
  const darkColor = [baseColor[0] / 3, baseColor[1], baseColor[2]];
  const backgroundColor = [baseColor[0] / 10, baseColor[1], baseColor[2]];

  return {
    base: serialize(baseColor, OKLCH, sRGB),
    background: serialize(backgroundColor, OKLCH, sRGB),
    lightShade: serialize(lightColor, OKLCH, sRGB),
    darkShade: serialize(darkColor, OKLCH, sRGB),
  };
}

const defaultColorPalette = createColorPalette("#ffffff");

function getRandomBoolean(probability: number) {
  if (probability < 0 || probability > 1) {
    throw new Error("Probability must be between 0 and 1");
  }
  // Return true with the given probability, else false
  return Math.random() < probability;
}

function drawAsymmetricCubeGrid(size: number, probability: number) {
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

function drawSymmetricCubeGrid(size: number, probability: number) {
  const cubeGrid = new IsometricGroup();
  const pattern = createRandomSymmetricPattern(size, probability);
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

function updateColor(
  canvas: IsometricCanvas | null,
  colorPalette: ColorPalette,
) {
  if (canvas) {
    const cubes = canvas.getElement().getElementsByTagName("g");
    for (const cube of cubes) {
      const sides = cube.getElementsByTagName("path");
      sides[0].setAttribute("fill", colorPalette.base);
      sides[1].setAttribute("fill", colorPalette.lightShade);
      sides[2].setAttribute("fill", colorPalette.darkShade);
      sides[1].setAttribute("stroke", colorPalette.darkShade);
      sides[2].setAttribute("stroke", colorPalette.darkShade);
      sides[0].setAttribute("stroke", colorPalette.darkShade);
    }
  }
}

// This is a 'hack'. Currently we cannot update the background via the libraries API.
function updateBackgroundColor(
  canvas: IsometricCanvas | null,
  colorPalette: ColorPalette,
) {
  if (canvas) {
    const background = canvas.getElement().getElementsByTagName("rect")[0];
    background.setAttribute("fill", colorPalette.background);
  }
}

function drawCube(x: number, y: number, z: number) {
  const commonProps: Omit<IsometricRectangleProps, "planeView"> = {
    height: 1,
    width: 1,
    strokeColor: defaultColorPalette.darkShade,
    strokeWidth: 6,
    // fillOpacity: 0.5,
  };

  const top = new IsometricRectangle({
    top: 1,
    fillColor: defaultColorPalette.base,
    planeView: PlaneView.TOP,
    ...commonProps,
  });
  const right = new IsometricRectangle({
    right: 1,
    fillColor: defaultColorPalette.lightShade,
    planeView: PlaneView.FRONT,
    ...commonProps,
  });
  const left = new IsometricRectangle({
    left: 1,
    fillColor: defaultColorPalette.darkShade,
    planeView: PlaneView.SIDE,
    ...commonProps,
  });

  const cube = new IsometricGroup({ top: z, right: x, left: y });
  cube.addChildren(top, right, left);
  // Let user remove individual cubes via mouse click.
  cube.addEventListener("click", () => cube.getElement().remove());
  return cube;
}

function createMirroredCube(size: number, pattern: boolean[][]) {
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
          // Keep the inner part of the cube empty
          cube[x][y][z] = false;
        }
      }
    }
  }

  return cube;
}

function createRandomSymmetricPattern(size: number, probability: number) {
  if (size <= 0) {
    throw new Error("Size must be a positive integer.");
  }
  if (size < 3) {
    throw new Error("Size must be at least 3");
  }
  if (size % 2 === 0) {
    throw new Error("Size must be an odd number");
  }

  const pattern: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false),
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
  const allFalse = pattern.every((row) => row.every((cell) => cell === false));

  // If the pattern is all true or all false, regenerate
  if (allTrue || allFalse) {
    return createRandomSymmetricPattern(size, probability);
  }

  return pattern;
}

function handleDraw(
  canvas: IsometricCanvas | null,
  size: number,
  shape: Shape,
  probability: number,
) {
  if (canvas) {
    canvas.clear();
    // This keeps the cube evenly sized.
    canvas.scale = 300 / size;

    if (shape === "symmetric") {
      canvas.addChild(drawSymmetricCubeGrid(size, probability));
    } else {
      canvas.addChild(drawAsymmetricCubeGrid(size, probability));
    }
  }
}

function handleUpdateColor(
  canvas: IsometricCanvas | null,
  colorPalette: ColorPalette,
) {
  updateColor(canvas, colorPalette);
  updateBackgroundColor(canvas, colorPalette);
}

export type UseCubeProps = {
  size: number;
  shape: Shape;
  color: string;
  probability: number;
};

function useCube(
  props: UseCubeProps = {
    size: 3,
    shape: "symmetric",
    color: "#ffffff",
    probability: 0.8,
  },
) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [size, setSize] = useState(props.size);
  const [shape, setShape] = useState<Shape>(props.shape);
  const [color, setColor] = useState(props.color);
  const [probability, setProbability] = useState(props.probability);

  const colorPalette = createColorPalette(color);
  const { ref, downloadSVG, clear, canvas, isReady } = useIsometricCanvas();

  function handleRegenerate() {
    if (isReady) {
      handleDraw(canvas, size, shape, probability);
    }
  }

  if (isInitialLoad && isReady) {
    handleUpdateColor(canvas, colorPalette);
    handleDraw(canvas, size, shape, probability);
    setIsInitialLoad(false);
  }

  const inputProps = {
    size: {
      value: size,
      min: "3",
      max: "7",
      step: "2",
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setSize(Number.parseInt(event.target.value));
        handleRegenerate();
      },
    },
    shape: {
      value: shape,
      onChange: (event: ChangeEvent<HTMLSelectElement>) => {
        setShape(event.target.value as Shape);
        handleRegenerate();
      },
    },
    color: {
      value: color,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
        handleUpdateColor(canvas, colorPalette);
      },
    },
    probability: {
      value: probability,
      min: "0.1",
      max: "0.9",
      step: "0.1",
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setProbability(Number.parseFloat(event.target.value));
        handleRegenerate();
      },
    },
  };

  return {
    ref,
    downloadSVG,
    clear,
    regenerate: handleRegenerate,
    inputProps,
  };
}

export default useCube;
