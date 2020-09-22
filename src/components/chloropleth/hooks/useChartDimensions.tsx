import { useRef, MutableRefObject } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';

/**
 * This code was originally inspired by https://wattenberger.com/blog/react-and-d3
 *
 * However the ResizeObserver from the original wasn't working properly and the
 * useResizeObserver hook allows us to cut out pretty much all of the complexity
 * while making it more React-like.
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

  return {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    boundedHeight: Math.max(height - marginTop - marginBottom, 0),
    boundedWidth: Math.max(width - marginLeft - marginRight, 0),
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

export const useChartDimensions = (
  chartDimensions: TChartDimensions = {}
): [MutableRefObject<HTMLElement | null>, TCombinedChartDimensions] => {
  /**
   * The ref will be initialized from the outside by mutating the return value of this
   * hook. This is a bit funky.
   *
   * @REF https://trello.com/c/i25FG3jk/548-usechartdemensions-pass-ref-as-prop
   */
  const ref = useRef<HTMLElement | null>(null);

  const { width, height } = useResizeObserver({ ref });

  /**
   * The previous useChartDimensions implementation allowed the passed in width and height to overrule any
   * observed sizes. This is not currently used in the app, so we could decide
   * to take it out. This implementation follows that same behavior for now.
   */
  const shouldOverruleWidthAndHeight =
    chartDimensions.width && chartDimensions.height;

  return [
    ref,
    combineChartDimensions({
      width: shouldOverruleWidthAndHeight ? chartDimensions.width : width,
      height: shouldOverruleWidthAndHeight ? chartDimensions.height : height,
    }),
  ];
};
