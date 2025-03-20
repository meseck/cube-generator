import useCube from "./useCube.tsx";
import styles from "./CubeGenerator.module.css";

function CubeGenerator() {
  const { ref, inputProps, regenerate, downloadSVG } = useCube();

  function handleOnRegenerate() {
    regenerate();
  }

  function handleDownload() {
    downloadSVG();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvas} ref={ref} />
      <div className={styles.menu}>
        <div className={styles.input}>
          <label htmlFor="size">Shape</label>
          <select id="shape" {...inputProps.shape}>
            <option value="symmetric">Symmetric</option>
            <option value="asymmetric">Asymmetric</option>
          </select>
        </div>
        <div className={styles.input}>
          <label htmlFor="size">Size</label>
          <input
            className={styles.slider}
            id="size"
            type="range"
            {...inputProps.size}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="probability">Density</label>
          <input
            className={styles.slider}
            id="probability"
            type="range"
            {...inputProps.probability}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="color">Color</label>
          <input id="color" type="color" {...inputProps.color} />
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
    </div>
  );
}

export default CubeGenerator;
