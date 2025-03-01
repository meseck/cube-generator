import {
  IsometricCanvas,
  IsometricRectangle,
  PlaneView,
} from "@elchininet/isometric";
import "./App.css";
import { useEffect, useRef } from "react";

function draw(canvas: IsometricCanvas) {
  const commonProps = { height: 1, width: 1 };

  const top = new IsometricRectangle({
    ...commonProps,
    id: "cube-top",
    planeView: PlaneView.TOP,
  });
  const right = new IsometricRectangle({
    ...commonProps,
    id: "cube-right",
    className: "right-piece",
    planeView: PlaneView.FRONT,
  });
  const left = new IsometricRectangle({
    ...commonProps,
    id: "cube-left",
    planeView: PlaneView.SIDE,
  });

  top.top = 1;
  right.right = 1;
  left.left = 1;

  canvas
    .addChild(top)
    .addChild(right)
    .addChild(left);
}

function App() {
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
        scale: 120,
        width: 500,
        height: 320,
      });

      draw(canvas);
    }

    return () => {
      canvas?.getElement().remove();
    };
  }, []);

  return (
    <>
      <div ref={ref} />
      <button type="button" onClick={handleClick}>
        Save SVG
      </button>
    </>
  );
}

export default App;
