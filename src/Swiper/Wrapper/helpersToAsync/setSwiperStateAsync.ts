import { SetterOrUpdater } from "recoil";

export default function setSwiperStateAsync([state, setStateToSwiper]: [
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
  