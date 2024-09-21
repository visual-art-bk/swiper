type tParamInitChunks = {
  indexToDuplicateSlide: number;
  indexToLastSlide: number;
};
type tParamGetRenderingChunk = {
  sizeToSlides: number;
  indexToDuplicateSlide: number;
  sizeToDuplicateSlides: number;
};
export type tRenderingForSlide = {
  isDuplicateSlide: boolean;
  key: string;
  content: {
    textContent: string;
    itemId?: string;
    href?: string;
  };
  playPros: {
    durationToPlaySlide?: number;
  };
};
/**
 * DEV
 */
const addItemIds = (index: number) => {
  const chunksToAdd = [
    { itemId: "test3" },
    { itemId: "test1" },
    { itemId: "test2" },
    { itemId: "test3" },
    { itemId: "test4" },
  ];

  return chunksToAdd[index];
};
/**
 * DEV
 */
const addHrefs = (index: number) => {
  const chunks = [
    { href: "a" },
    { href: "a1" },
    { href: "a2" },
    { href: "a3" },
    { href: "a4" },
    { href: "a5" },
    { href: "a6" },
  ];

  return chunks[index];
};
/**
 *
 */
const initChunks =
  ({ indexToDuplicateSlide, indexToLastSlide }: tParamInitChunks) =>
  (chunk: unknown, index: number) => {
    const isDuplicate = index === indexToDuplicateSlide ? true : false;

    const redering: tRenderingForSlide = {
      key: `${isDuplicate === true ? "duplicate" : ""}-slide-${index}`,
      isDuplicateSlide: isDuplicate,
      content: {
        textContent:
          isDuplicate === true ? indexToLastSlide.toString() : index.toString(),
      },
      playPros: {},
    };

    return (chunk = redering);
  };
/**
 *
 */
const addChunks = (chunk: tRenderingForSlide, index: number) => {
  chunk.content.itemId = addItemIds(index).itemId;
  chunk.content.href = addHrefs(index).href;
};
/**
 *
 * @param props
 * @returns
 */
const addPropsToPlay =
  (indexesToTargetSlide: number[]) => (chunk: tRenderingForSlide, index: number) => {
    const filteredTargetIndexes = indexesToTargetSlide.filter(target => target === index)

    if (filteredTargetIndexes.length === 0) {
      return
    }

    const devDurationPlaySlide = 0
    chunk.playPros.durationToPlaySlide = devDurationPlaySlide 
  };
/**
 *
 *
 */
export const getRenderingChunks = (
  props: tParamGetRenderingChunk
): tRenderingForSlide[] => {
  const { indexToDuplicateSlide, sizeToDuplicateSlides, sizeToSlides } = props;

  const length = sizeToSlides + sizeToDuplicateSlides;
  const renderingChunks = Array.from({ length }).map(
    initChunks({
      indexToDuplicateSlide,
      indexToLastSlide: length - 1,
    })
  );

  renderingChunks.forEach(addChunks);

  renderingChunks.forEach(addPropsToPlay([2]))

  return renderingChunks;
};
