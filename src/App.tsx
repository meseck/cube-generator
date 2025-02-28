import './App.css'
import { useState, useEffect } from 'react'
import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps
} from "@p5-wrapper/react";

type MySketchProps = SketchProps & {
  rotation: number;
};

function sketch(p5: P5CanvasInstance<MySketchProps>) {
  let rotation = 0;

  p5.setup = () => p5.createCanvas(600, 400, p5.WEBGL);

  p5.updateWithProps = props => {
    if (props.rotation) {
      rotation = (props.rotation * Math.PI) / 180;
    }
  };

  p5.draw = () => {
    p5.background(100);
    p5.normalMaterial();
    p5.noStroke();
    p5.push();
    p5.rotateY(rotation);
    p5.box(100);
    p5.pop();
  };
}

function App() {
  const [rotation, setRotation] = useState(0);

    useEffect(() => {
      const interval = setInterval(
        () => setRotation(rotation => rotation + 100),
        100
      );

      return () => {
        clearInterval(interval);
      };
    }, []);

    return <ReactP5Wrapper sketch={sketch} rotation={rotation} />;
}

export default App
