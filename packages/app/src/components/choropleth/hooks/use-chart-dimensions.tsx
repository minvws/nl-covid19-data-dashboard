import { useElementSize } from '~/utils/use-element-size';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useViewport } from '~/utils/use-viewport';

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

type TChartDimensions = {
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

export function useChartDimensions<T extends HTMLElement>(
  initialWidth: number,
  aspectRatio: number
) {
  const isMounted = useIsMounted();
  const viewport = useViewport();
  const [ref, { width, height }] = useElementSize<T>(initialWidth);
  const calculatedHeight = Math.min(
    // always fit the choropleth inside the viewport
    isMounted ? viewport.height * 0.9 : Infinity,
    aspectRatio && width ? width * aspectRatio : height
  );

  return [
    ref,
    combineChartDimensions({
      width,
      height: calculatedHeight,
    }),
  ] as const;
}
