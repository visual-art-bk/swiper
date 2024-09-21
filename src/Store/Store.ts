import { atom } from "recoil";
import { initialSwiperState } from "./intialStates/initialSwiperState";
import { intitialSlideState } from "./intialStates/intialSlideState";
import { initialLottieTextState } from "./intialStates/initialLottieTextState";
import { initialImageMatrixerState } from "./intialStates/initialImageMatrixerState";
const Store = (() => {
  const atomToSwiper = atom({
    key: "swiper-state",
    default: initialSwiperState,
  });

  const atomToSlide = atom({
    key: "slide-state",
    default: intitialSlideState,
  });

  const atomToLotteText = atom({
    key: "lottie-text-state",
    default: initialLottieTextState,
  });

  const atomToImageMatrixer = atom({
    key: "image-matrixer-state",
    default: initialImageMatrixerState,
  });

  return {
    getAtoms: () => ({
      atomToSwiper,
      atomToSlide,
      atomToLotteText,
      atomToImageMatrixer,
    }),
  };
})();

export default Store;
