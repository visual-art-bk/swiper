import "./swiper.module.css";
import Wrapper from "./Wrapper/Wrapper";

const PREFIX = '_swp-dm-39'
/**
 * @returns 
 */
export default function Swiper() {
  return (
    <div className="swiper-container" prefix={PREFIX}>
      <Wrapper></Wrapper>
    </div>
  );
}
