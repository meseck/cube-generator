import { useEffect, useRef, useState } from "react";
import { IsometricCanvas } from "@elchininet/isometric";

function useIsometricCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<IsometricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  async function handleCopySVG() {
    if (ref.current) {
      const clipboardItem = new ClipboardItem({
        "text/plain": ref.current.innerHTML,
      });
      await navigator.clipboard.write([clipboardItem]);
    }
  }

  function handleClear() {
    canvasRef.current?.clear();
  }

  useEffect(() => {
    if (ref.current) {
      const canvas = new IsometricCanvas({
        container: ref.current,
        backgroundColor: "#00000000",
        scale: 100,
        width: 800,
        height: 800,
      });
      canvasRef.current = canvas;
      setIsReady(true);
    }

    return () => {
      canvasRef.current?.getElement().remove();
    };
  }, []);

  return {
    ref,
    canvas: canvasRef.current,
    copySVG: handleCopySVG,
    clear: handleClear,
    isReady,
  };
}

export default useIsometricCanvas;
