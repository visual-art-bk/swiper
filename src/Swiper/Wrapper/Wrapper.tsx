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
import { Slide } from "./Slide/Slide";
import Store from "@/Store/Store";

const { atomToSwiper } = Store.getAtoms();
const PREFIX = "_swiperWrp-je-32";

const DURATION_MS = 5000;
const DELAY_AFTER_WIDTH_RESIZE_MS = 3000;
const INDEX_TO_DUPLICATE_SLIDE = 0;
const INDEX_TO_START_SLIDE = 1;
const INDEX_TO_LAST_SLIDE = 2;
const FOR_DEV_INDEX_TO_DUPLICATE_SLIDE = INDEX_TO_LAST_SLIDE + 1;
const SLIDES_SIZE = INDEX_TO_LAST_SLIDE + 1;

let timeOutID: NodeJS.Timeout;
let timeouId: NodeJS.Timeout;

export default function Wrapper() {
  //@TODO It should do clearfy.
  const refs = createRefsToSlide(SLIDES_SIZE);
  //@TODO It should do clearfy. what FOR_DEV_INDEX_TO_DUPLICATE_SLIDE?
  const refForDuplicateSlide = refs[FOR_DEV_INDEX_TO_DUPLICATE_SLIDE];

  const [stateToSwiper, setStateToSwiper] = useRecoilState(atomToSwiper);
  const [stateToClassName, setStateToClassName] = useState("swiper-wrapper");

  const [stateIndexToSlide, setStateIndexToSlide] =
    useState(INDEX_TO_START_SLIDE);
  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );

  const DuplicateSlideComponent = [refForDuplicateSlide].map((ref) => {
    return (
      <Fragment key={"duplicate_" + FOR_DEV_INDEX_TO_DUPLICATE_SLIDE}>
        <Slide
          isDuplicateSlide={true}
          ref={ref}
          uidIndex={INDEX_TO_DUPLICATE_SLIDE}
          endIndex={INDEX_TO_LAST_SLIDE}
          startIndex={INDEX_TO_DUPLICATE_SLIDE}
          stateIndexToSlide={stateIndexToSlide}
          rendering={{
            textContent: FOR_DEV_INDEX_TO_DUPLICATE_SLIDE.toString(),
          }}
        ></Slide>
      </Fragment>
    );
  });

  const SlideComponents = refs.map((ref, index) => {
    return (
      <Fragment key={index}>
        <Slide
          isDuplicateSlide={false}
          ref={ref}
          uidIndex={index + INDEX_TO_START_SLIDE}
          endIndex={INDEX_TO_LAST_SLIDE}
          startIndex={INDEX_TO_DUPLICATE_SLIDE}
          stateIndexToSlide={stateIndexToSlide}
          rendering={{
            textContent: (index + INDEX_TO_START_SLIDE).toString(),
          }}
        ></Slide>
      </Fragment>
    );
  });

  const AllSlideComponent = [DuplicateSlideComponent, ...SlideComponents];

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
      const duration =
        stateIndexToSlide === INDEX_TO_DUPLICATE_SLIDE ? 0 : DURATION_MS;

      timeOutID = setTimeout(runSlide, duration);

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
        clearTimeout(timeouId);
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
      {AllSlideComponent}
    </div>
  );
}

function createRefsToSlide(slideSize: number) {
  let refsToSlide: RefObject<HTMLDivElement>[] = [];

  let i = 0;
  while (i < slideSize) {
    refsToSlide.push(useRef(document.createElement("div")));
    i++;
  }
  return refsToSlide;
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
  duration,
}: {
  stateIndexToSlide: number;
  indexToDuplicateSlideForMask: number;
  duration: number;
}) {
  const durationWhenDuplicateSlideMask = 0;
  return stateIndexToSlide === indexToDuplicateSlideForMask
    ? durationWhenDuplicateSlideMask
    : duration;
}
