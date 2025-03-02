import { useEffect, useRef } from "react";
import { IsometricCanvas } from "@elchininet/isometric";

export type ColorPalette = {
  base: string;
  lightShade: string;
  darkShade: string;
};

type CanvasProps = {
  draw: (canvas: IsometricCanvas, colorPalette: ColorPalette) => void;
};

function Canvas({ draw }: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);

  async function handleClick() {
    if (ref.current) {
      const clipboardItem = new ClipboardItem({
        "text/plain": ref.current.innerHTML,
      });
      await navigator.clipboard.write([clipboardItem]);
    }
  }

  useEffect(() => {
    let canvas: IsometricCanvas | null;

    if (ref.current) {
      canvas = new IsometricCanvas({
        container: ref.current,
        backgroundColor: "#00000000",
        scale: 100,
        width: 800,
        height: 800,
      });

      const monoColorPalette = {
        base: "#FFFFFF",
        lightShade: "#FFFFFF",
        darkShade: "#343434",
      };

      draw(canvas, monoColorPalette);
    }

    return () => {
      canvas?.getElement().remove();
    };
  }, []);

  return (
    <>
      <div id="canvas-wrapper" ref={ref}></div>
      <button type="button" onClick={handleClick}>
        Save SVG
      </button>
    </>
  );
}

export default Canvas;
