import { ChangeEvent, useState } from "react";
import useCube from "./useCube.tsx";

const monoColorPalette = {
  base: "#FFFFFF",
  lightShade: "#FFFFFF",
  darkShade: "#343434",
};

function CubeGenerator() {
  const [probability, setProbability] = useState(0.8);
  const [size, setSize] = useState(3);
  const { ref, draw, saveSVG } = useCube(size, probability, monoColorPalette);

  function handleProbabilityChange(event: ChangeEvent<HTMLInputElement>) {
    setProbability(parseFloat(event.target.value));
  }

  function handleSizeChange(event: ChangeEvent<HTMLInputElement>) {
    setSize(parseInt(event.target.value));
  }

  function handleOnSaveSVG() {
    saveSVG();
  }

  function handleOnGenerate() {
    draw();
  }

  return (
    <>
      <div id="canvas-wrapper" ref={ref}></div>
      <input
        type="range"
        min="1"
        max="10"
        value={size}
        onChange={handleSizeChange}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={probability}
        onChange={handleProbabilityChange}
      />
      <button type="button" onClick={handleOnSaveSVG}>
        Save SVG
      </button>
      <button type="button" onClick={handleOnGenerate}>
        Regenerate
      </button>
    </>
  );
}

export default CubeGenerator;
