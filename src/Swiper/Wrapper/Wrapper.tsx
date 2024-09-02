import {
  Fragment,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import "./wrapper.module.css";
import { Slide } from "./Slide/Slide";

const PREFIX = "_swiperWrp-je-32";

const DURATION = 3000;
const INDEX_TO_FIRST_SLIDE = 0;
const INDEX_TO_START_SLIDE = 1;
const INDEX_TO_LAST_SLIDE = 4;
const INDEX_TO_DUPLICATE_SLIDE = INDEX_TO_LAST_SLIDE + 1;
const SLIDES_SIZE = INDEX_TO_LAST_SLIDE + 1;

export default function Wrapper() {
  const refs = createRefsToSlide(SLIDES_SIZE);
  const refForDuplicateSlide = refs[INDEX_TO_DUPLICATE_SLIDE];

  const [stateIndexToSlide, setStateIndexToSlide] =
    useState(INDEX_TO_START_SLIDE);
  const [stateHaveRunSlide, setStateHaveRunSlide] = useState(false);
  const [stateClassName, setStateClassName] = useState("swiper-wrapper");
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
    setStateClassName("swiper-wrapper");
    setStateIndexToSlide(INDEX_TO_FIRST_SLIDE);
  };

  const resumeSlide = () => {
    setStateIndexToSlide(INDEX_TO_START_SLIDE);
    setStateClassName("swiper-wrapper loaded");
  };

  const runSlide = () => {
    let indexToNextSlide = 0;

    if (stateIndexToSlide > INDEX_TO_LAST_SLIDE) {
      indexToNextSlide = INDEX_TO_START_SLIDE;

      initStartPositionByDuplicateSlide();
      setTimeout(resumeSlide);
      return;
    } else {
      indexToNextSlide = stateIndexToSlide + 1;
    }

    setStateHaveRunSlide(true);
    setStateIndexToSlide(indexToNextSlide);
    setStateClassName("swiper-wrapper loaded");
  };

  useEffect(() => {
    const intervalID = setInterval(runSlide, DURATION);

    return () => {
      clearInterval(intervalID);
    };
  }, [stateIndexToSlide, stateHaveRunSlide]);

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

  // for dev
  // useEffect(() => {
  //   console.log("stateIndexToSlide", stateIndexToSlide);
  // }, [stateIndexToSlide]);

  return (
    <div
      className={stateClassName}
      style={{
        transform: `translate3D(${
          stateIndexToSlide * -stateToWindowWidth
        }px, 0, 0)`,
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
