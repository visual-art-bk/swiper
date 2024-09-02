import React, {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useState,
} from "react";

import "./slide.module.css";

const PREFIX = "_swpSlide-md-54";

const CLASSNAME_DEFAULT = "swiper-slide";
const CLASSNAME_DUPLICATE = "duplicate";
const CLASSNAME_ACTIVE = "swiper-slide-active";
const CLASSNAME_PREV = "swiper-slide-prev";
const CLASSNAME_NEXT = "swiper-slide-next";

type tIndexes = {
  isDuplicateSlide: boolean;
  startIndex: number;
  endIndex: number;
  uidIndex: number;
  stateIndexToSlide: number;
  rendering: {
    textContent: string;
  };
};
export const Slide = forwardRef(function Slide(
  props: tIndexes,
  ref: ForwardedRef<HTMLDivElement>
) {
  const {
    endIndex,
    startIndex,
    stateIndexToSlide,
    uidIndex,
    rendering,
    isDuplicateSlide,
  } = props;

  const { textContent } = rendering;

  const [stateClassNamesToDuplicateSlide, setStateClassNamesToDuplicateSlide] =
    useState(CLASSNAME_DEFAULT);

  const [stateClassNameToSlide, setStateClassNameToSlide] =
    useState(CLASSNAME_DEFAULT);

  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );

  const whenSlideIsActive = uidIndex === stateIndexToSlide;
  const whenSlideIsNext = uidIndex === stateIndexToSlide + 1;
  const whenSlideIsPrev = uidIndex === stateIndexToSlide - 1;
  const whenSlideIsPrevAndLastSlide =
    stateIndexToSlide === startIndex && uidIndex === endIndex;
  const whenSlideIsPrevAndFirstSlide =
    stateIndexToSlide === endIndex && uidIndex === startIndex;

  /**
   *
   */
  const updateClassNames = () => {
    if (whenSlideIsActive) {
      setStateClassNameToSlide(
        getClassnames([CLASSNAME_DEFAULT, CLASSNAME_ACTIVE])
      );
    } else if (whenSlideIsPrev) {
      setStateClassNameToSlide(
        getClassnames([CLASSNAME_DEFAULT, CLASSNAME_PREV])
      );
    } else if (whenSlideIsNext) {
      setStateClassNameToSlide(
        getClassnames([CLASSNAME_DEFAULT, CLASSNAME_NEXT])
      );
    } else if (whenSlideIsPrevAndFirstSlide) {
      setStateClassNameToSlide(
        getClassnames([CLASSNAME_DEFAULT, CLASSNAME_NEXT])
      );
    } else if (whenSlideIsPrevAndLastSlide) {
      setStateClassNameToSlide(
        getClassnames([CLASSNAME_DEFAULT, CLASSNAME_PREV])
      );
    } else {
      setStateClassNameToSlide(CLASSNAME_DEFAULT);
    }
  };

  useEffect(() => {
    updateClassNames();
  }, [stateIndexToSlide]);

  useEffect(() => {
    if (isDuplicateSlide === true) {
      setStateClassNamesToDuplicateSlide(
        `${CLASSNAME_DEFAULT} ${CLASSNAME_DUPLICATE}`
      );
    }
  }, []);

  useEffect(() => {
    const updateWindowSize = (event: UIEvent) => {
      const { innerWidth } = window;
   
      setStateToWindowInnerWidth(innerWidth);
    };

    window.addEventListener("resize", updateWindowSize);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  // dev
  useEffect(() => {
    console.warn("stateToWindowWidth", stateToWindowWidth);
  }, [stateToWindowWidth]);

  return (
    <div
      className={
        isDuplicateSlide === true
          ? stateClassNamesToDuplicateSlide
          : stateClassNameToSlide
      }
      itemID={uidIndex.toString()}
      prefix={PREFIX}
      style={{ width: `${stateToWindowWidth}px` }}
      ref={ref}
    >
      <div> {textContent}</div>
    </div>
  );
});

function getClassnames(classnames: string[]) {
  return classnames.join(" ");
}
