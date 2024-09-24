import lottie from "lottie-web";
import { useEffect, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import Store from "@/Store/Store";
// import { TimeoutPromiser } from "@/Swiper/helpers/TimeoutPromiser";
// const { TimeoutIdManager, setStateTimeout } = TimeoutPromiser();

let timeOutList: NodeJS.Timeout[] = [];

const { atomToLotteText, atomToSlide } = Store.getAtoms();
type tLottie = {
  uidIndex: number;
  indexToDuplicateSlide: number;
  endIndex: number;
};
export default function Lottie(props: tLottie) {
  const stateToSlide = useRecoilValue(atomToSlide);
  const [stateToLottieText, setStateToLottieText] =
    useRecoilState(atomToLotteText);

  const { uidIndex, indexToDuplicateSlide, endIndex } = props;
  const lottieRef = useRef(document.createElement("div"));

  useEffect(() => {
    if (uidIndex !== stateToSlide.currentIndex) {
      return;
    }
    lottie
      .loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "dist/json/lottie-slide.json",
        // path: 'https://rchr-lab.store/wp-content/uploads/swiper-test/dist/json/lottie-slide.json',
        name: `${uidIndex}`,
      })
      .addEventListener("complete", () => {
        const timeOutId = setTimeout(() => {
          setStateToLottieText({
            ...stateToLottieText,
            didPlayUp: true,
          });
        }, 3000);
        timeOutList.push(timeOutId);
      });

    return () => {
      timeOutList.forEach((id) => {
        clearTimeout(id);
      });
      timeOutList = [];
    };
  }, [stateToSlide.currentIndex]);

  useEffect(() => {
    if (uidIndex === stateToSlide.currentIndex + 1) {
      lottieRef.current.innerHTML = "";
      return;
    }

    if (stateToSlide.currentIndex === endIndex) {
      if (uidIndex === indexToDuplicateSlide) {
        lottieRef.current.innerHTML = "";
        return;
      }
    }
  }, [stateToSlide.currentIndex, stateToLottieText.didPlayUp]);

  // log for dev.
  useEffect(() => {
    if (uidIndex !== stateToSlide.currentIndex) {
      return;
    }
    console.warn(
      `[ index: ${stateToSlide.currentIndex} ][ C - 1 - Lottie Play Up!] stateToLottieText.didPlayUp: `,
      stateToLottieText.didPlayUp
    );
  }, [stateToSlide.currentIndex, stateToLottieText.didPlayUp]);

  return <div id="lottie" ref={lottieRef}></div>;
}
