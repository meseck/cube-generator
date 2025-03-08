import { ChangeEvent, useState } from "react";
import useCube, { Shape } from "./useCube.tsx";
import styles from "./CubeGenerator.module.css";

function CubeGenerator() {
  const [size, setSize] = useState(3);
  const [shape, setShape] = useState<Shape>("symmetric");
  const [color, setColor] = useState("#ffffff");
  const [probability, setProbability] = useState(0.8);

  const { ref, regenerate, copySVG } = useCube(size, shape, color, probability);

  function handleShapeChange(event: ChangeEvent<HTMLSelectElement>) {
    setShape(event.target.value as Shape);
  }

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

  function handleOnRegenerate() {
    regenerate();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvas} ref={ref}></div>
      <div className={styles.menu}>
        <div className={styles.input}>
          <label htmlFor="size">Shape</label>
          <select id="shape" value={shape} onChange={handleShapeChange}>
            <option value="symmetric">Symmetric</option>
            <option value="asymmetric">Asymmetric</option>
          </select>
        </div>
        <div className={styles.input}>
          <label htmlFor="size">Size</label>
          <input
            id="size"
            type="range"
            min="3"
            max="7"
            step="2"
            value={size}
            onChange={handleSizeChange}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="probability">Density</label>
          <input
            id="probability"
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
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
        <div className={styles.actions}>
          <button type="button" onClick={handleOnCopySVG}>
            Copy SVG
          </button>
          <button type="button" onClick={handleOnRegenerate}>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

export default CubeGenerator;
