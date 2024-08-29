import { createRoot } from "react-dom/client";
import Swiper from "./Swiper/Swiper";
const rootId = "rootToSwiper";
const rootElement = document.getElementById(rootId);

if (rootElement === null) {
  throw new Error("해당 id를 참조한 엘리멘터 값이 null입니다. id: " + rootId);
}

createRoot(rootElement).render(<App></App>);

export default function App() {
  return <Swiper></Swiper>;
}
