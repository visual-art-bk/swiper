import { atom } from "recoil";
import { initialSwiperState } from "./intialStates/initialSwiperState";
import { intitialSlideState } from "./intialStates/intialSlideState";
const Store = (() => {
  const atomToSwiper = atom({
    key: "swiper-state",
    default: initialSwiperState,
  });

  const atomToSlide = atom({
    key: "slide-state",
    default: intitialSlideState,
  });

  return {
    getAtoms: () => ({
      atomToSwiper,
      atomToSlide
    }),
  };
})();

export default Store;
