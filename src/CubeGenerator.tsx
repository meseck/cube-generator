import "./variables.css";
import styles from "./CubeGenerator.module.css";
import useCube from "./useCube.tsx";

const CubeGenerator = () => {
  const { ref, inputProps, regenerate, downloadSVG } = useCube();
  const handleOnRegenerate = () => {
    regenerate();
  };

  const handleDownload = () => {
    downloadSVG();
  };

  return (
    <div id="cube-generator" className={styles.wrapper}>
      <div className={styles.canvas} ref={ref} />
      <div className={styles.menu}>
        <fieldset className={styles.fieldset}>
          <legend>Cube</legend>
          <div className={styles.fieldsetContent}>
            <label htmlFor="size">Shape</label>
            <select id="shape" {...inputProps.shape}>
              <option value="symmetric">Symmetric</option>
              <option value="asymmetric">Asymmetric</option>
            </select>
            <label htmlFor="size">Size</label>
            <input
              className={styles.slider}
              id="size"
              type="range"
              {...inputProps.size}
            />
            <label htmlFor="probability">Density</label>
            <input
              className={styles.slider}
              id="probability"
              type="range"
              {...inputProps.probability}
            />
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend>Color</legend>
          <div className={styles.fieldsetContent}>
            <label htmlFor="baseColor">Top/Base</label>
            <input id="baseColor" type="color" {...inputProps.baseColor} />
            <label htmlFor="leftColor">Left</label>
            <input id="leftColor" type="color" {...inputProps.leftColor} />
            <label htmlFor="rightColor">Right</label>
            <input id="rightColor" type="color" {...inputProps.rightColor} />
            <label htmlFor="backgroundColor">Background</label>
            <input
              id="backgroundColor"
              type="color"
              {...inputProps.backgroundColor}
            />
          </div>
        </fieldset>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={handleDownload}>
          Download SVG
        </button>
        <button type="button" onClick={handleOnRegenerate}>
          Regenerate
        </button>
      </div>
    </div>
  );
};

export default CubeGenerator;
