import { useEffect, useRef, useState } from "react";
import { IsometricCanvas } from "@elchininet/isometric";

function useIsometricCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<IsometricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  function handleClear() {
    canvasRef.current?.clear();
  }

  function handleDownloadSVG() {
    if (canvasRef.current) {
      const svg = canvasRef.current.getElement().outerHTML;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const blobURL = URL.createObjectURL(blob);

      const tempAnchor = document.createElement("a") as HTMLAnchorElement;
      tempAnchor.href = blobURL;
      tempAnchor.download = "cube.svg";
      document.body.appendChild(tempAnchor);
      tempAnchor.click();

      document.body.removeChild(tempAnchor);
      URL.revokeObjectURL(blobURL);
    }
  }

  useEffect(() => {
    if (ref.current) {
      const canvas = new IsometricCanvas({
        container: ref.current,
        backgroundColor: "#000000",
        scale: 100,
        width: 800,
        height: 800,
      });

      // Add missing namespace
      canvas.getElement().setAttribute("xmlns", "http://www.w3.org/2000/svg");

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
    downloadSVG: handleDownloadSVG,
    clear: handleClear,
    isReady,
  };
}

export default useIsometricCanvas;
