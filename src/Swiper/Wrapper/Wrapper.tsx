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
import setSwiperStateAsync from "./helpersToAsync/setSwiperStateAsync";

const { atomToSwiper, atomToSlide } = Store.getAtoms();
const PREFIX = "_swiperWrp-je-32";

//TODO duration is related to width of window. set valut to state.
const DURATION_MS = 500;

const DELAY_AFTER_WIDTH_RESIZE_MS = 3000;
const INDEX_TO_DUPLICATE_SLIDE = 0;
const INDEX_TO_START_SLIDE = 1;
const INDEX_TO_LAST_SLIDE = 2;
const SLIDES_SIZE = INDEX_TO_LAST_SLIDE + 1;

let TIMEOUT_ID: NodeJS.Timeout;

export default function Wrapper() {
  const [stateToSwiper, setStateToSwiper] = useRecoilState(atomToSwiper);
  const [stateToClassName, setStateToClassName] = useState("swiper-wrapper");
  const [stateToSlide, setStateToSlide] = useRecoilState(atomToSlide);
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
          uidIndex={index}
          playPros={{
            durationToPlaySlide:
              chunk.playPros.durationToPlaySlide !== undefined
                ? chunk.playPros.durationToPlaySlide
                : 0,
          }}
          durationForSlider={DURATION_MS}
        ></Slide>
      </Fragment>
    );
  });

  const SlideRunner = async () => {
    if (stateToSlide.currentIndex > INDEX_TO_LAST_SLIDE) {
      await setSwiperStateAsync([
        { motionState: "inactive", transition: "" },
        setStateToSwiper,
      ]);

      let ms = 4000;
      console.warn(`............ {__dev__delay} [${ms}] ms`);
      await __dev__delay(ms);

      setStateToSlide({
        didPlayUp: false,
        currentIndex: INDEX_TO_DUPLICATE_SLIDE,
      });
      return;
    }

    if (
      (stateToSlide.currentIndex === INDEX_TO_DUPLICATE_SLIDE ||
        stateToSlide.currentIndex === INDEX_TO_START_SLIDE) &&
      stateToSwiper.motionState === "inactive" &&
      stateToSwiper.transition === ""
    ) {
      await setSwiperStateAsync([
        { motionState: "active", transition: "transform 300ms ease-in-out" },
        setStateToSwiper,
      ]);
    }

    let ms = 4000;
    console.warn(`............ {__dev__delay} [${ms}] ms`);
    await __dev__delay(ms);

    setStateToSlide({
      didPlayUp: false,
      currentIndex: stateToSlide.currentIndex + 1,
    });
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

  useEffect(
    function Initializer() {
      const durationToSlides = adjustDuration({
        durationToSlides: DURATION_MS,
        indexToDuplicateSlideForMask: INDEX_TO_DUPLICATE_SLIDE,
        currentIndex: stateToSlide.currentIndex,
      });

      if (stateToSlide.didPlayUp === true) {
        TIMEOUT_ID = setTimeout(SlideRunner, durationToSlides);
      }

      return () => {
        clearTimeout(TIMEOUT_ID);
      };
    },
    [stateToSlide.didPlayUp]
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

  // dev for log
  useEffect(() => {
    console.warn("stateToSwiper", stateToSwiper);
  }, [stateToSwiper]);
  useEffect(() => {
    console.warn("stateToSlide currentIndex", stateToSlide.currentIndex);
  }, [stateToSlide.currentIndex]);
  useEffect(() => {
    console.warn("stateToSlide.didPlayUp", stateToSlide.didPlayUp);
    console.warn(`
      `);
  }, [stateToSlide.didPlayUp]);
  return (
    <div
      className={stateToClassName}
      style={{
        transform: `translate3D(${
          stateToSlide.currentIndex * -stateToWindowWidth
        }px, 0, 0)`,
        transition: stateToSwiper.transition,
      }}
      prefix={PREFIX}
    >
      {testSlideChunks}
    </div>
  );
}

function __dev__delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function adjustDuration({
  currentIndex,
  indexToDuplicateSlideForMask,
  durationToSlides,
}: {
  currentIndex: number;
  indexToDuplicateSlideForMask: number;
  durationToSlides: number;
}) {
  const durationWhenDuplicateSlideMask = 0;
  return currentIndex === indexToDuplicateSlideForMask
    ? durationWhenDuplicateSlideMask
    : durationToSlides;
}
