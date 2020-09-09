import { ResizeObserver } from '@juggle/resize-observer';
import { useRef, useState, useEffect } from 'react';

/**
 * This custom hook has been taken from the wonderful blog of
 * Amelia Wattenberger. https://wattenberger.com/blog/react-and-d3
 * We tried using @vx/responsive but felt it lacking in documentation and
 * it didn't work on IE11. This way we have more control over how we resize
 * our charts. Plus, who doesn't love D3 margin conventions?
 */

const combineChartDimensions = (
  dimensions = {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  }
) => {
  const { marginTop, marginRight, marginBottom, marginLeft } = dimensions;

  const parsedDimensions = {
    ...dimensions,
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

type IChartDimensions = {
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

const useChartDimensions = (passedSettings?: IChartDimensions) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // @ts-ignore
  useEffect(() => {
    // If we provide an explicit width and height, we simply return the dimensions
    // as they are, but run through combineChartDimensions. In other words,
    // when both width and height are set we don't need to set up a ResizeObserver
    if (dimensions.width && dimensions.height) return [ref, dimensions];

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width != entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height != entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });
    // @ts-ignore
    resizeObserver.observe(element);
    // @ts-ignore
    return () => resizeObserver.unobserve(element);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

export default useChartDimensions;
