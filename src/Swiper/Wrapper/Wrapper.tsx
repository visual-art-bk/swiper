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
const DELAY_AFTER_WIDTH_RESIZE = 3000;
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

  const [stateIndexToSlide, setStateIndexToSlide] =
    useState(INDEX_TO_START_SLIDE);
  const [stateClassName, setStateClassName] = useState("swiper-wrapper");
  const [stateToWindowWidth, setStateToWindowInnerWidth] = useState(
    window.innerWidth
  );
  const [stateToSlideWrapper, setStateToSlideWrapper] = useState({
    isRunning: false,
    transition: "",
  });

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
    setStateToSlideWrapper({
      ...stateToSlideWrapper,
      transition: "",
      isRunning: false,
    });
  };

  const resumeSlideAfterInitPosition = () => {
    setStateIndexToSlide(INDEX_TO_START_SLIDE);
    setStateClassName("swiper-wrapper loaded");
    setStateToSlideWrapper({
      ...stateToSlideWrapper,
      transition: "transform 400ms ease-in-out",
      isRunning: true,
    });
  };

  const runSlide = () => {
    if (
      stateToSlideWrapper.isRunning === false ||
      stateToSlideWrapper.transition === ""
    ) {
      setStateToSlideWrapper({
        ...stateToSlideWrapper,
        transition: "transform 400ms ease-in-out",
        isRunning: true,
      });
    }

    let indexToNextSlide = 0;
    if (stateIndexToSlide > INDEX_TO_LAST_SLIDE) {
      indexToNextSlide = INDEX_TO_START_SLIDE;

      initStartPositionByDuplicateSlide();
      setTimeout(resumeSlideAfterInitPosition);
      return;
    } else {
      indexToNextSlide = stateIndexToSlide + 1;
    }

    setStateIndexToSlide(indexToNextSlide);
    setStateClassName("swiper-wrapper loaded");
  };

  const updateStateToSlideAfterResize = () => {
    setTimeout(() => {
      setStateToSlideWrapper({
        ...stateToSlideWrapper,
        isRunning: true,
      });
    }, DELAY_AFTER_WIDTH_RESIZE);
  }

  useEffect(
    function SliderWrapperRunner() {
      intervalID = setInterval(runSlide, DURATION);

      return () => {
        clearInterval(intervalID);
      };
    },
    [stateIndexToSlide, stateToSlideWrapper]
  );

  useEffect(
    function WidthResizer() {
      const updateWindowSize = (event: UIEvent) => {
        clearInterval(intervalID);

        const { innerWidth } = window;
        setStateToWindowInnerWidth(innerWidth);

        setStateToSlideWrapper({
          ...stateToSlideWrapper,
          transition: "",
          isRunning: false,
        });

        updateStateToSlideAfterResize()
      };

      window.addEventListener("resize", updateWindowSize);

      return () => {
        window.removeEventListener("resize", updateWindowSize);
        clearTimeout(timeouId);
      };
    },
    [stateToSlideWrapper]
  );

  // dev
  useEffect(() => {
    console.warn('stateToSlideWrapper', stateToSlideWrapper)
  })
  return (
    <div
      className={stateClassName}
      style={{
        transform: `translate3D(${
          stateIndexToSlide * -stateToWindowWidth
        }px, 0, 0)`,
        transition: stateToSlideWrapper.transition,
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
