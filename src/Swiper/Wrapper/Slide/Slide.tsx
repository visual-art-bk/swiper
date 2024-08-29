import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useState,
} from "react";

const CLASSNAME_DEFAULT = "swiper-slide";
const CLASSNAME_ACTIVE = "swiper-slide-active";
const CLASSNAME_PREV = "swiper-slide-prev";
const CLASSNAME_NEXT = "swiper-slide-next";

type tIndexes = {
  startIndex: number;
  endIndex: number;
  uidIndex: number;
  stateIndexToSlide: number;
};
export const Slide = forwardRef(function Slide(
  props: tIndexes,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { endIndex, startIndex, stateIndexToSlide, uidIndex } = props;

  const [stateClassNameToSlide, setStateClassNameToSlide] =
    useState(CLASSNAME_DEFAULT);

  const whenSlideIsActive = uidIndex === stateIndexToSlide;
  const whenSlideIsNext = uidIndex === stateIndexToSlide + 1;
  const whenSlideIsPrev = uidIndex === stateIndexToSlide - 1;
  const whenSlideIsPrevAndLastSlide =
    stateIndexToSlide === startIndex && uidIndex === endIndex;
  const whenSlideIsPrevAndFirstSlide =
    stateIndexToSlide === endIndex && uidIndex === startIndex;

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
  return <div className={stateClassNameToSlide} ref={ref}></div>;
});

function getClassnames(classnames: string[]) {
  return classnames.join(" ");
}
