import React, {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useState,
} from "react";
import "./slide.module.css";
import Store from "@/Store/Store";
import ImageMatrixer from "./ImageMatrixer/ImageMatrixer";
import { useRecoilState } from "recoil";

const { atomToSlide } = Store.getAtoms();

const PREFIX = "_swpSlide-md-54";

const CLASSNAME_DEFAULT = "swiper-slide";
const CLASSNAME_DUPLICATE = "duplicate";
const CLASSNAME_ACTIVE = "swiper-slide-active";
const CLASSNAME_PREV = "swiper-slide-prev";
const CLASSNAME_NEXT = "swiper-slide-next";

let TIMEOUT_ID: NodeJS.Timeout;

type tIndexes = {
  isDuplicateSlide: boolean;
  startIndex: number;
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
    startIndex,
    uidIndex,
    rendering,
    isDuplicateSlide,
    playPros,
    durationForSlider,
  } = props;

  const { textContent } = rendering;

  const [stateToSlide, setStateToSlide] = useRecoilState(atomToSlide);

  const [stateClassNamesToDuplicateSlide, setStateClassNamesToDuplicateSlide] =
    useState(CLASSNAME_DEFAULT);

  const [stateClassNameToSlide, setStateClassNameToSlide] =
    useState(CLASSNAME_DEFAULT);

  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );

  /**
   *
   */
  const updateClassNames = () => {
    const whenSlideIsActive = uidIndex === stateToSlide.currentIndex;

    const whenSlideIsNext = uidIndex === stateToSlide.currentIndex + 1;

    const whenSlideIsPrev = uidIndex === stateToSlide.currentIndex - 1;
    const whenSlideIsPrevAndLastSlide =
      stateToSlide.currentIndex === startIndex && uidIndex === endIndex;

    const whenSlideIsPrevAndFirstSlide =
      stateToSlide.currentIndex === endIndex && uidIndex === startIndex;

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

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const setStateToSlideAsync = () => {
    // console.log(`index ${uidIndex}_[Slide]: Play DONE`);

    return new Promise((resolve) => {
      resolve(
        setStateToSlide({
          currentIndex: stateToSlide.currentIndex,
          didPlayUp: true,
        })
      );
    });
  };

  async function playSlide() {
    await delay(
      adjustPlayTime({
        additionalPlayTime: isDuplicateSlide === true ? 0 : 5000,
        durationForSlider,
        durationToPlaySlide: playPros.durationToPlaySlide,
      })
    );

    await setStateToSlideAsync();
  }

  useEffect(() => {
    if (uidIndex === stateToSlide.currentIndex) {
      playSlide();
    }

    return () => {
      clearTimeout(TIMEOUT_ID);
    };
  }, [stateToSlide.currentIndex]);

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
      {/* DEV */}
      <a href={props.rendering.href}>
        {/* <ImageMatrixer></ImageMatrixer> */}
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
