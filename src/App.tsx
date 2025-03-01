import {
  IsometricCanvas,
  IsometricRectangle,
  PlaneView,
} from "@elchininet/isometric";
import "./App.css";
import { useEffect, useRef } from "react";

function createCanvas() {
  const id = "canvas";

  function draw(container: HTMLElement) {
    function drawCube(canvas: IsometricCanvas) {
      const commonProps = { height: 1, width: 1 };

      const topPiece = new IsometricRectangle({
        ...commonProps,
        planeView: PlaneView.TOP,
      });
      const rightPiece = new IsometricRectangle({
        ...commonProps,
        planeView: PlaneView.FRONT,
      });
      const leftPiece = new IsometricRectangle({
        ...commonProps,
        planeView: PlaneView.SIDE,
      });

      topPiece.top = 1;
      rightPiece.right = 1;
      leftPiece.left = 1;

      canvas
        .addChild(topPiece)
        .addChild(rightPiece)
        .addChild(leftPiece);
    }

    const canvas = new IsometricCanvas({
      id,
      container,
      backgroundColor: "#CCC",
      scale: 120,
      width: 500,
      height: 320,
    });

    drawCube(canvas);
  }

  return {
    remove: () => {
      document.getElementById(id)?.remove();
    },
    draw: (container: HTMLElement) => {
      draw(container);
    },
  };
}

function App() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { draw, remove } = createCanvas();

    if (ref.current) {
      draw(ref.current);
    }

    return () => {
      remove();
    };
  }, []);

  return (
    <>
      <div ref={ref} />
      A new start!
    </>
  );
}

export default App;
