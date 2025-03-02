import { ChangeEvent, useState } from "react";
import useCube from "./useCube.tsx";

function CubeGenerator() {
  const [probability, setProbability] = useState(0.8);
  const [size, setSize] = useState(3);
  const [color, setColor] = useState("#ffffff");

  const { ref, draw, saveSVG } = useCube(size, probability, color);

  function handleProbabilityChange(event: ChangeEvent<HTMLInputElement>) {
    setProbability(parseFloat(event.target.value));
  }

  function handleSizeChange(event: ChangeEvent<HTMLInputElement>) {
    setSize(parseInt(event.target.value));
  }

  function handleOnChangeColor(event: ChangeEvent<HTMLInputElement>) {
    setColor(event.target.value);
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
      <input type="color" value={color} onChange={handleOnChangeColor} />
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
