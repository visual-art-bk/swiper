import "./imag-matrixer.module.css";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import Store from "@/Store/Store";
import { TimeoutPromiser } from "@/Swiper/helpers/TimeoutPromiser";
// const { setStateTimeout, TimeoutIdManager } = TimeoutPromiser();
// const TimeOutIdManager = (() => {
//   let ids: NodeJS.Timeout[] = [];

//   return {
//     init() {
//       ids = [];
//     },
//     add(id: NodeJS.Timeout) {
//       ids.push(id);
//     },
//     getIds() {
//       return ids;
//     },
//   };
// })();

type tMastrxStyleParams = [
  styles: string,
  setStateImgMatrixer: React.Dispatch<React.SetStateAction<string>>
];

const { atomToSlide, atomToImageMatrixer } = Store.getAtoms();

const DURATION_IMAGE_MATRIXER = 1500;

const INIT_VALUES_FOR_MATRIX = {
  MATRIX_SCALE_X: 2,
  MATRIX_SCALE_Y: 2,
  SKREW_X: 0,
  SKREW_Y: 0,
  MATRIX_TRANSLATE_X: -100,
  MATRIX_TRANSLATE_Y: -100,
};

let timeoutIdList: NodeJS.Timeout[] = [];

type tImageMatrix = {
  uidIndex: number;
  endIndex: number;
  indexToDuplicateSlide: number;
};
export default function ImageMatrixer(props: tImageMatrix) {
  const { uidIndex, endIndex, indexToDuplicateSlide } = props;

  const stateToSlide = useRecoilValue(atomToSlide);

  const [stateImgMatrixer, setStateImgMatrixer] =
    useRecoilState(atomToImageMatrixer);

  const [stateMatrixStyle, setStateMatrixStyle] = useState(
    makeValuesForMatrix({
      scaleX: INIT_VALUES_FOR_MATRIX.MATRIX_SCALE_X,
      scaleY: INIT_VALUES_FOR_MATRIX.MATRIX_SCALE_Y,
      translateX: INIT_VALUES_FOR_MATRIX.MATRIX_TRANSLATE_X,
      translateY: INIT_VALUES_FOR_MATRIX.MATRIX_TRANSLATE_Y,
    })
  );

  const [stateMaxtrixerTransition, setStateMaxtrixerTransition] = useState(
    `transform ${DURATION_IMAGE_MATRIXER}ms ease-in-out`
  );

  // type tSetStateImgMatrixerAsyncParams = [
  //   state: typeof stateImgMatrixer,
  //   setState: typeof setStateImgMatrixer
  // ];
  // type tSetStateMaxtrixerTransitionAyncParams = [
  //   state: typeof stateMaxtrixerTransition,
  //   setState: typeof setStateMaxtrixerTransition
  // ];

  // const setStateMaxtrixerTransitionAync = (
  //   props: tSetStateMaxtrixerTransitionAyncParams,
  //   delay?: number
  // ) => setStateTimeout(props, delay);

  // const setStateMatrixStyleAsync = (props: tMastrxStyleParams, delay: number) =>
  //   setStateTimeout(props, delay);

  // const setStateImgMatrixerAsync = (
  //   props: tSetStateImgMatrixerAsyncParams,
  //   delay?: number
  // ) => setStateTimeout(props, delay);

  const playMatrixer = async (timeoutIds: NodeJS.Timeout[]) => {
    if (stateToSlide.currentIndex === indexToDuplicateSlide) {
      setStateMaxtrixerTransition("");
      setStateImgMatrixer({ didPlayUp: false });
      return;
    }

    await new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(
          setStateMaxtrixerTransition(
            `transform ${DURATION_IMAGE_MATRIXER}ms ease-in-out`
          )
        );
      }, 0);

      timeoutIds.push(timeoutId);
    });

    await new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(
          setStateMatrixStyle(
            makeValuesForMatrix({
              scaleX: 1.5,
              scaleY: 1.5,
              translateX: -100,
              translateY: -200,
            })
          )
        );
      }, 1000);

      timeoutIds.push(timeoutId);
    });

    // await setStateMatrixStyleAsync(
    //   [
    //     makeValuesForMatrix({
    //       scaleX: 1.5,
    //       scaleY: 1.5,
    //       translateX: -100,
    //       translateY: -200,
    //     }),
    //     setStateMatrixStyle,
    //   ],
    //   1000
    // )

    // await setStateImgMatrixerAsync(
    //   [{ didPlayUp: true }, setStateImgMatrixer],
    //   10000
    // );

    await new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(setStateImgMatrixer({ didPlayUp: true }));
      }, 3000);

      timeoutIds.push(timeoutId);
    });
  };

  const initStyles = () => {
    setStateMatrixStyle(
      makeValuesForMatrix({
        scaleX: INIT_VALUES_FOR_MATRIX.MATRIX_SCALE_X,
        scaleY: INIT_VALUES_FOR_MATRIX.MATRIX_SCALE_Y,
        translateX: INIT_VALUES_FOR_MATRIX.MATRIX_TRANSLATE_X,
        translateY: INIT_VALUES_FOR_MATRIX.MATRIX_TRANSLATE_Y,
      })
    );
  };
  useEffect(() => {
    if (
      uidIndex !== stateToSlide.currentIndex &&
      uidIndex !== indexToDuplicateSlide
    ) {
      initStyles();
      return;
    }

    playMatrixer(timeoutIdList);

    return () => {
      // TimeoutIdManager.clearIds();

      timeoutIdList.forEach((id) => {
        clearTimeout(id);
      });
      timeoutIdList = [];
    };
  }, [stateToSlide.currentIndex]);

  useEffect(() => {
    if (uidIndex !== stateToSlide.currentIndex) {
      return;
    }
    console.warn(
      `[ index: ${stateToSlide.currentIndex} ][ C - 2 - ImageMatrixer Play Up! ]  stateImgMatrixer.didPlayUp: `,
      stateImgMatrixer.didPlayUp
    );
  }, [stateToSlide.currentIndex, stateImgMatrixer.didPlayUp]);

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
          transform={stateMatrixStyle}
          className="lottie-matrix"
          opacity="1"
          style={{
            display: "block",
            transition: stateMaxtrixerTransition,
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

// function promiseWithTimeOut(
//   [state, setState]: [state: any, setState: Function],
//   delay?: number
// ) {
//   let duration = delay === undefined ? 0 : delay;
//   return new Promise((resolve) => {
//     const timeOutId = setTimeout(() => {
//       resolve(setState(state));
//     }, duration);

//     TimeOutIdManager.add(timeOutId);
//   });
// }
