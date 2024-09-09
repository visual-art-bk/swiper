import {
  Fragment,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
  useReducer,
} from "react";
import { SetterOrUpdater, useRecoilState } from "recoil";

import "./wrapper.module.css";
import {
  getRenderingChunks,
  tRenderingForSlide,
} from "./renderingForSlide/renderingForSlide";
import { Slide } from "./Slide/Slide";
import Store from "@/Store/Store";

const { atomToSwiper } = Store.getAtoms();
const PREFIX = "_swiperWrp-je-32";

const DURATION_MS = 5000;
const DELAY_AFTER_WIDTH_RESIZE_MS = 3000;
const INDEX_TO_DUPLICATE_SLIDE = 0;
const INDEX_TO_START_SLIDE = 1;
const INDEX_TO_LAST_SLIDE = 2;
const SLIDES_SIZE = INDEX_TO_LAST_SLIDE + 1;

export default function Wrapper() {
  const [stateToSwiper, setStateToSwiper] = useRecoilState(atomToSwiper);
  const [stateToClassName, setStateToClassName] = useState("swiper-wrapper");

  const [stateIndexToSlide, setStateIndexToSlide] =
    useState(INDEX_TO_START_SLIDE);
  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );

  const testSlideChunks = getRenderingChunks({
    indexToDuplicateSlide: INDEX_TO_DUPLICATE_SLIDE,
    sizeToDuplicateSlides: 1,
    sizeToSlides: SLIDES_SIZE,
  }).map((chunk, index) => {
    const { content, isDuplicateSlide, key } = chunk;
    return (
      <Fragment key={key}>
        <Slide
          endIndex={INDEX_TO_LAST_SLIDE}
          isDuplicateSlide={isDuplicateSlide}
          rendering={{
            textContent: content.textContent,
            itemId: content.itemId,
            href: content.href,
          }}
          startIndex={INDEX_TO_DUPLICATE_SLIDE}
          stateIndexToSlide={stateIndexToSlide}
          uidIndex={index}
        ></Slide>
      </Fragment>
    );
  });

  const runSlide = async () => {
    if (stateIndexToSlide > INDEX_TO_LAST_SLIDE) {
      await setSwiperStateAsync([
        { motionState: "inactive", transition: "" },
        setStateToSwiper,
      ]);

      await setIndexAsync([INDEX_TO_DUPLICATE_SLIDE, setStateIndexToSlide]);
      return;
    }

    if (
      (stateIndexToSlide === INDEX_TO_DUPLICATE_SLIDE ||
        stateIndexToSlide === INDEX_TO_START_SLIDE) &&
      stateToSwiper.motionState === "inactive" &&
      stateToSwiper.transition === ""
    ) {
      await setSwiperStateAsync([
        { motionState: "active", transition: "transform 300ms ease-in-out" },
        setStateToSwiper,
      ]);
    }

    await setIndexAsync([stateIndexToSlide + 1, setStateIndexToSlide]);
  };

  const updateWindowSize = () => {
    const { innerWidth } = window;
    setStateToWindowInnerWidth(innerWidth);

    setStateToSwiper({
      ...stateToSwiper,
      motionState: "inactive",
      transition: "",
    });
    resumeSlideAfterResizeWidth();
  };

  const resumeSlideAfterResizeWidth = () => {
    setTimeout(() => {
      setStateToSwiper({
        ...stateToSwiper,
        motionState: "active",
        transition: "transform 300ms ease-in-out",
      });
    }, DELAY_AFTER_WIDTH_RESIZE_MS);
  };

  useEffect(
    function SliderWrapperRunner() {
      const durationToSlides = adjustDuration({
        durationToSlides: DURATION_MS,
        indexToDuplicateSlideForMask: INDEX_TO_DUPLICATE_SLIDE,
        stateIndexToSlide,
      });

      const timeOutID = setTimeout(runSlide, durationToSlides);

      return () => {
        clearTimeout(timeOutID);
      };
    },
    [stateIndexToSlide]
  );

  useEffect(
    function WidthResizer() {
      window.addEventListener("resize", updateWindowSize);

      return () => {
        window.removeEventListener("resize", updateWindowSize);
      };
    },
    [stateToWindowWidth]
  );

  useEffect(() => {
    if (stateToSwiper.motionState === "active") {
      setStateToClassName("swiper-wrapper loaded");
    } else {
      setStateToClassName("swiper-wrapper");
    }
  }, [stateToSwiper.motionState]);

  // dev
  useEffect(() => {
    console.warn("stateToSwiper", stateToSwiper);
  }, [stateToSwiper]);

  return (
    <div
      className={stateToClassName}
      style={{
        transform: `translate3D(${
          stateIndexToSlide * -stateToWindowWidth
        }px, 0, 0)`,
        transition: stateToSwiper.transition,
      }}
      prefix={PREFIX}
    >
      {testSlideChunks}
    </div>
  );
}

function setIndexAsync([indexToSet, setStateIndexToSlide]: [
  indexToSet: number,
  setStateIndexToSlide: React.Dispatch<React.SetStateAction<number>>
]) {
  return new Promise((resolve) => {
    resolve(setStateIndexToSlide(indexToSet));
  });
}

function setSwiperStateAsync([state, setStateToSwiper]: [
  { motionState: string; transition: string },
  setStateToSwiper: SetterOrUpdater<{
    motionState: string;
    transition: string;
  }>
]) {
  return new Promise((resolve) => {
    resolve(
      setStateToSwiper({
        motionState: state.motionState,
        transition: state.transition,
      })
    );
  });
}

function adjustDuration({
  stateIndexToSlide,
  indexToDuplicateSlideForMask,
  durationToSlides,
}: {
  stateIndexToSlide: number;
  indexToDuplicateSlideForMask: number;
  durationToSlides: number;
}) {
  const durationWhenDuplicateSlideMask = 0;
  return stateIndexToSlide === indexToDuplicateSlideForMask
    ? durationWhenDuplicateSlideMask
    : durationToSlides;
}
