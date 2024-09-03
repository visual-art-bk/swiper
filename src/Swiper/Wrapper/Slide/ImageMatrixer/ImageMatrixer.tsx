import "./imag-matrixer.module.css";
import { useEffect, useState } from "react";

const VALUES_FOR_MATRIX = {
  MATRIX_SCALE_X: 2,
  MATRIX_SCALE_Y: 2,
  SKREW_X: 0,
  SKREW_Y: 0,
  MATRIX_TRANSLATE_X: -100,
  MATRIX_TRANSLATE_Y: -100,
};

function makeValuesForMatrix({
  scaleX,
  scaleY,
  translateX,
  translateY,
}: {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}) {
  return `matrix(${scaleX},0,0,${scaleY},${translateX},${translateY})`;
}

export default function ImageMatrixer() {
  const [matrixState, setMatrixState] = useState(
    makeValuesForMatrix({
      scaleX: VALUES_FOR_MATRIX.MATRIX_SCALE_X,
      scaleY: VALUES_FOR_MATRIX.MATRIX_SCALE_Y,
      translateX: VALUES_FOR_MATRIX.MATRIX_TRANSLATE_X,
      translateY: VALUES_FOR_MATRIX.MATRIX_TRANSLATE_Y,
    })
  );

  useEffect(() => {
    setTimeout(() => {
      setMatrixState(
        makeValuesForMatrix({
          scaleX: 1.5,
          scaleY: 1.5,
          translateX: -100,
          translateY: -200,
        })
      );
    });
  });
  return (
    <div className="image-matrixer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 900"
        width="1920"
        height="900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <g
          transform={matrixState}
          className="lottie-matrix"
          opacity="1"
          style={{
            display: "block",
          }}
        >
          <image
            width="2000px"
            height="1334px"
            preserveAspectRatio="xMidYMid slice"
            href="https://woowahan-cdn.woowahan.com/new_resources/image/banner/19841329127341b6a9360ed4c88d9f14.jpg"
          ></image>
        </g>
      </svg>
    </div>
  );
}
