import {
  Fragment,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
  useReducer,
} from "react";
import { useRecoilState } from "recoil";

import "./wrapper.module.css";
import { Slide } from "./Slide/Slide";
import Store from "@/Store/Store";

const { atomToSwiper } = Store.getAtoms();
const PREFIX = "_swiperWrp-je-32";

const DURATION_MS = 3000;
const DELAY_AFTER_WIDTH_RESIZE_MS = 3000;
const INDEX_TO_FIRST_SLIDE = 0;
const INDEX_TO_START_SLIDE = 1;
const INDEX_TO_LAST_SLIDE = 4;
const INDEX_TO_DUPLICATE_SLIDE = INDEX_TO_LAST_SLIDE + 1;
const SLIDES_SIZE = INDEX_TO_LAST_SLIDE + 1;

let intervalID: NodeJS.Timeout;
let timeouId: NodeJS.Timeout;

export default function Wrapper() {
  const refs = createRefsToSlide(SLIDES_SIZE);
  const refForDuplicateSlide = refs[INDEX_TO_DUPLICATE_SLIDE];

  const [stateToSwiper, setStateToSwiper] = useRecoilState(atomToSwiper);
  const [stateToClassName, setStateToClassName] = useState("swiper-wrapper");

  const [stateIndexToSlide, setStateIndexToSlide] =
    useState(INDEX_TO_START_SLIDE);
  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );

  const DuplicateSlideComponent = [refForDuplicateSlide].map((ref) => {
    return (
      <Fragment key={"duplicate_" + INDEX_TO_DUPLICATE_SLIDE}>
        <Slide
          isDuplicateSlide={true}
          ref={ref}
          uidIndex={INDEX_TO_DUPLICATE_SLIDE}
          endIndex={INDEX_TO_LAST_SLIDE}
          startIndex={INDEX_TO_FIRST_SLIDE}
          stateIndexToSlide={stateIndexToSlide}
          rendering={{
            textContent: INDEX_TO_DUPLICATE_SLIDE.toString(),
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
          startIndex={INDEX_TO_FIRST_SLIDE}
          stateIndexToSlide={stateIndexToSlide}
          rendering={{
            textContent: (index + INDEX_TO_START_SLIDE).toString(),
          }}
        ></Slide>
      </Fragment>
    );
  });

  const AllSlideComponent = [DuplicateSlideComponent, ...SlideComponents];

  const initStartPositionByDuplicateSlide = () => {
    setStateIndexToSlide(INDEX_TO_FIRST_SLIDE);
    setStateToSwiper({
      ...stateToSwiper,
      motionState: "inactive",
      transition: "",
    });
  };

  const resumeAtDuplicateSlideAfterInitPosition = () => {
    setStateIndexToSlide(INDEX_TO_START_SLIDE);
    setStateToSwiper({
      ...stateToSwiper,
      motionState: "active",
      transition: "transform 300ms ease-in-out",
    });
  };

  const runSlide = () => {
    if (
      stateToSwiper.motionState === "inactive" &&
      stateToSwiper.transition === ""
    ) {
      setStateToSwiper({
        ...stateToSwiper,
        motionState: "active",
        transition: "transform 300ms ease-in-out",
      });
    }
    let indexToNextSlide = 0;
    if (stateIndexToSlide > INDEX_TO_LAST_SLIDE) {
      indexToNextSlide = INDEX_TO_START_SLIDE;

      initStartPositionByDuplicateSlide();
      setTimeout(resumeAtDuplicateSlideAfterInitPosition);
      return;
    } else {
      indexToNextSlide = stateIndexToSlide + 1;
    }

    setStateIndexToSlide(indexToNextSlide);
  };

  const updateWindowSize = () => {
    clearInterval(intervalID);

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
      intervalID = setInterval(runSlide, DURATION_MS);

      return () => {
        clearInterval(intervalID);
      };
    },
    [stateIndexToSlide, stateToSwiper]
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
  // useEffect(() => {
  //   console.warn(
  //     "stateToSlideWrapper", stateOfSwiper

  //   );
  // }, [
  //   stateOfSwiper
  // ]);
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
