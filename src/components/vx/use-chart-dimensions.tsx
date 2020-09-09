import { ResizeObserver } from '@juggle/resize-observer';
import { useRef, useState, useEffect, MutableRefObject } from 'react';

/**
 * This custom hook has been taken from the wonderful blog of
 * Amelia Wattenberger. https://wattenberger.com/blog/react-and-d3
 * We tried using @vx/responsive but felt it lacking in documentation and
 * it didn't work on IE11. This way we have more control over how we resize
 * our charts. Plus, who doesn't love D3 margin conventions?
 */
const combineChartDimensions = (
  dimensions: TChartDimensions = {}
): TCombinedChartDimensions => {
  const {
    height = 0,
    width = 0,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
  } = dimensions;

  const parsedDimensions = {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};

export type TChartDimensions = {
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

export type TCombinedChartDimensions = TChartDimensions & {
  boundedWidth: number;
  boundedHeight: number;
};

const useChartDimensions = (
  passedSettings?: TChartDimensions
): [MutableRefObject<HTMLElement | null>, TCombinedChartDimensions] => {
  const ref = useRef<HTMLElement | null>(null);
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  if (dimensions.width && dimensions.height) {
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }

  useEffect(() => {
    // If we provide an explicit width and height, we simply return the dimensions
    // as they are, but run through combineChartDimensions. In other words,
    // when both width and height are set we don't need to set up a ResizeObserver
    if (width && height) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width != entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height != entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [width, height]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

export default useChartDimensions;
