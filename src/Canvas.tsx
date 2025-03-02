import useCube from "./useCube.tsx";

const monoColorPalette = {
  base: "#FFFFFF",
  lightShade: "#FFFFFF",
  darkShade: "#343434",
};

function Canvas() {
  const { ref, draw, saveSVG } = useCube(3, 0.8, monoColorPalette);

  function handleOnSaveSVG() {
    saveSVG();
  }

  function handleOnGenerate() {
    draw();
  }

  return (
    <>
      <div id="canvas-wrapper" ref={ref}></div>
      <button type="button" onClick={handleOnSaveSVG}>
        Save SVG
      </button>
      <button type="button" onClick={handleOnGenerate}>
        Generate
      </button>
    </>
  );
}

export default Canvas;
