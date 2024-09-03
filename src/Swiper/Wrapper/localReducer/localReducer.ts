const DELAY_AFTER_WIDTH_RESIZE_MS = 3000;

export const swiperStateType = {
  inactive: "inactive",
  active: "active",
};
export const actionTypes = {
  inilizedPosition: "initialized_position",
  resisedWindowWidth: "resized_window_width",
  runSwiper: "run_swiper",
};
export const swiperClassNameStateType = {
  default: "swiper-wrapper",
  loaded: "swiper-wrapper loaded",
};
type tState = {
  swiper: string;
  transition: string;
  classNames: string;
};
type tAction = {
  type: string;
};
export const initialStateToSwiper: tState = {
  swiper: swiperStateType.inactive,
  transition: "",
  classNames: swiperClassNameStateType.default,
};
export const localReducer = (state: tState, action: tAction): tState => {
  if (action.type === actionTypes.inilizedPosition) {
    return {
      ...state,
      swiper: swiperStateType.inactive,
      transition: "",
      classNames: swiperClassNameStateType.default,
    };
  }
  if (action.type === actionTypes.resisedWindowWidth) {
    return {
      ...state,
      swiper: swiperStateType.inactive,
      transition: "",
      classNames: swiperClassNameStateType.default,
    };
  }
  if (action.type === actionTypes.runSwiper) {
    return {
      ...state,
      swiper: swiperStateType.active,
      transition: "transform 300ms ease-in-out",
      classNames: swiperClassNameStateType.loaded,
    };
  }
  throw Error("Unknown the action of reducer to Swiper.");
};
