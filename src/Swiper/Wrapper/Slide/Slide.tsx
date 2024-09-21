import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useState,
} from "react";
import "./slide.module.css";
import Store from "@/Store/Store";
import Lottie from "./Lottie/Lottie";
import ImageMatrixer from "./ImageMatrixer/ImageMatrixer";
import { useRecoilState, useRecoilValue } from "recoil";

const { atomToSlide, atomToLotteText, atomToImageMatrixer } = Store.getAtoms();

const PREFIX = "_swpSlide-md-54";

const CLASSNAME_DEFAULT = "swiper-slide";
const CLASSNAME_DUPLICATE = "duplicate";
const CLASSNAME_ACTIVE = "swiper-slide-active";
const CLASSNAME_PREV = "swiper-slide-prev";
const CLASSNAME_NEXT = "swiper-slide-next";

let TIMEOUT_ID: NodeJS.Timeout;

type tIndexes = {
  isDuplicateSlide: boolean;
  indexToDuplicateSlide: number;
  endIndex: number;
  uidIndex: number;
  rendering: {
    textContent: string;
    itemId?: string;
    href?: string;
  };
  playPros: {
    durationToPlaySlide?: number;
  };
  durationForSlider: number;
};
export const Slide = forwardRef(function Slide(
  props: tIndexes,
  ref: ForwardedRef<HTMLDivElement>
) {
  const {
    endIndex,
    indexToDuplicateSlide,
    uidIndex,
    rendering,
    isDuplicateSlide,
    playPros,
    durationForSlider,
  } = props;

  const { textContent } = rendering;

  const [stateToSlide, setStateToSlide] = useRecoilState(atomToSlide);
  const [stateToLottieText, setStateToLottieText] =
    useRecoilState(atomToLotteText);
  const stateImgMatrixer = useRecoilValue(atomToImageMatrixer);

  const [stateClassNamesToDuplicateSlide, setStateClassNamesToDuplicateSlide] =
    useState(CLASSNAME_DEFAULT);

  const [stateClassNameToSlide, setStateClassNameToSlide] =
    useState(CLASSNAME_DEFAULT);

  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );

  const updateClassNames = () => {
    const whenSlideIsActive = uidIndex === stateToSlide.currentIndex;

    const whenSlideIsNext = uidIndex === stateToSlide.currentIndex + 1;

    const whenSlideIsPrev = uidIndex === stateToSlide.currentIndex - 1;
    const whenSlideIsPrevAndLastSlide =
      stateToSlide.currentIndex === indexToDuplicateSlide &&
      uidIndex === endIndex;

    const whenSlideIsPrevAndFirstSlide =
      stateToSlide.currentIndex === endIndex &&
      uidIndex === indexToDuplicateSlide;

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
  }, [stateToSlide.currentIndex]);

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
  }, [stateToWindowWidth]);

  async function playSlideAsync() {
    setStateToSlide({
      ...stateToSlide,
      didPlayUp: true,
    });
  }

  useEffect(() => {
    if (stateToSlide.currentIndex !== uidIndex) {
      return;
    }

    if (
      stateToLottieText.didPlayUp === true &&
      stateImgMatrixer.didPlayUp === true
    ) {
      playSlideAsync();
    }
  }, [
    stateToSlide.currentIndex,
    stateToLottieText.didPlayUp,
    stateImgMatrixer.didPlayUp,
  ]);
  useEffect(() => {
    if (stateToSlide.currentIndex !== uidIndex) {
      return;
    }
    console.warn(
      `[ index: ${stateToSlide.currentIndex} ][ B-Slide ] - stateToSlide.didPlayUp:`,
      stateToSlide.didPlayUp
    );
  }, [stateToSlide.didPlayUp]);

  return (
    <div
      className={
        isDuplicateSlide === true
          ? stateClassNamesToDuplicateSlide
          : stateClassNameToSlide
      }
      itemID={props.rendering.itemId}
      prefix={PREFIX}
      style={{ width: `${stateToWindowWidth}px` }}
      ref={ref}
    >
      <a href={props.rendering.href}>
        <Lottie
          uidIndex={uidIndex}
          endIndex={endIndex}
          indexToDuplicateSlide={indexToDuplicateSlide}
        ></Lottie>

        <ImageMatrixer 
        uidIndex={uidIndex}
        endIndex={endIndex}
        indexToDuplicateSlide={indexToDuplicateSlide}
        ></ImageMatrixer>

        <div>{rendering.textContent}</div>
      </a>
    </div>
  );
});

function getClassnames(classnames: string[]) {
  return classnames.join(" ");
}
type tPropsToAdjustPlayTime = {
  durationForSlider: number;
  durationToPlaySlide: number | undefined;
  additionalPlayTime: number;
};
function adjustPlayTime(props: tPropsToAdjustPlayTime) {
  const { additionalPlayTime, durationForSlider, durationToPlaySlide } = props;
  return (
    durationForSlider +
    (durationToPlaySlide === undefined ? 0 : durationToPlaySlide) +
    additionalPlayTime
  );
}
