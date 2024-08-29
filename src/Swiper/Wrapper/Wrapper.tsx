import { Fragment, useEffect, useRef, useState } from "react";
import "./wrapper.module.css";
import { Slide } from "./Slide/Slide";

const DURATION = 3000;
let START_INDEX = 0;
let END_INDEX = 5;
let nextIndex = 0;
const SLIDES_SIZE = END_INDEX + 1;

export default function Wrapper() {
  const [stateIndexToSlide, setStateIndexToSlide] = useState(START_INDEX);
  const [stateHaveRunSlide, setStateHaveRunSlide] = useState(false);

  const refsToSlide = Array.from({ length: SLIDES_SIZE }).map((_v) =>
    useRef(document.createElement("div"))
  );

  const SlideComponents = refsToSlide.map((ref, index) => {
    return (
      <Fragment key={index}>
        <Slide
          ref={ref}
          uidIndex={index}
          endIndex={END_INDEX}
          startIndex={START_INDEX}
          stateIndexToSlide={stateIndexToSlide}
        ></Slide>
      </Fragment>
    );
  });

  const runSlide = () => {
    if (stateIndexToSlide === END_INDEX) {
      nextIndex = START_INDEX;
    } else {
      nextIndex = stateIndexToSlide + 1;
    }

    setStateHaveRunSlide(true);
    setStateIndexToSlide(nextIndex);
  };

  useEffect(() => {
    const intervalID = setInterval(runSlide, DURATION);

    if (stateHaveRunSlide === true) {
      console.log("Next index =>", stateIndexToSlide);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [stateIndexToSlide, stateHaveRunSlide]);
  return <div className="swiper-wrapper">{SlideComponents}</div>;
}
