import { ChangeEvent, useState } from "react";
import useCube from "./useCube.tsx";
import styles from "./CubeGenerator.module.css";

function CubeGenerator() {
  const [probability, setProbability] = useState(0.8);
  const [size, setSize] = useState(3);
  const [color, setColor] = useState("#ffffff");

  const { ref, draw, copySVG } = useCube(size, probability, color);

  function handleProbabilityChange(event: ChangeEvent<HTMLInputElement>) {
    setProbability(parseFloat(event.target.value));
  }

  function handleSizeChange(event: ChangeEvent<HTMLInputElement>) {
    setSize(parseInt(event.target.value));
  }

  function handleOnChangeColor(event: ChangeEvent<HTMLInputElement>) {
    setColor(event.target.value);
  }

  function handleOnCopySVG() {
    copySVG();
  }

  function handleOnGenerate() {
    draw();
  }

  return (
    <>
      <div className={styles.canvas} ref={ref}></div>
      <div className={styles.menu}>
        <div className={styles.config}>
          <div className={styles.input}>
            <label htmlFor="size">Size</label>
            <input
              id="size"
              type="range"
              min="1"
              max="6"
              value={size}
              onChange={handleSizeChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="probability">Probability</label>
            <input
              id="probability"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={probability}
              onChange={handleProbabilityChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="color">Color</label>
            <input
              id="color"
              type="color"
              value={color}
              onChange={handleOnChangeColor}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={handleOnCopySVG}>
            Copy SVG
          </button>
          <button type="button" onClick={handleOnGenerate}>
            Regenerate
          </button>
        </div>
      </div>
    </>
  );
}

export default CubeGenerator;
