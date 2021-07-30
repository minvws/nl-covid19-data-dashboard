import { useMemo } from 'react';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Bounds, Padding } from './common';

/**
 * A chart with a width smaller than the threshold can be rendered with a
 * "collapsed" Y-axis.
 */
export const COLLAPSE_Y_AXIS_THRESHOLD = 430;

const defaultPadding: Padding = {
  top: 10,
  right: 0,
  bottom: 30,
  /**
   * The left padding gives room for the Y-axis labels.
   * for server-side rendered charts we set it to 40px in order to support
   * labels up to 4 digits (4,000).
   * During run-time (client-side) the actual Y-axis width will be measured,
   * unless a user gives a static paddingLeft via props. (@TODO I think we can
   * remove that prop from the time-series-chart api)
   */
  left: 40,
};

interface DimensionProps {
  width: number;
  height: number;
  paddingLeft?: number;
  paddingTop?: number;
  /**
   * A symmetrical padding ensures the right padding equals the left padding
   */
  applySymmetricalPadding?: boolean;
}

export function useDimensions({
  width,
  height,
  paddingLeft,
  paddingTop,
  applySymmetricalPadding,
}: DimensionProps) {
  const isMounted = useIsMounted();

  const [leftPaddingRef, { width: measuredLeftPadding = 0 }] =
    useResizeObserver<SVGGElement>();

  return useMemo(() => {
    const calculatedPaddingLeft =
      measuredLeftPadding > 0
        ? /**
           * A measured left padding is most likely measured on elements holding
           * text. It looks like using this exact value can sometimes result in
           * cut-off text, therefore we'll add a tiny bit of extra padding.
           */
          measuredLeftPadding + 5
        : measuredLeftPadding;

    const left = isMounted
      ? paddingLeft ?? calculatedPaddingLeft ?? defaultPadding.left
      : defaultPadding.left;

    const padding: Padding = {
      ...defaultPadding,
      left,
      top: paddingTop ?? defaultPadding.top,
      right: applySymmetricalPadding ? left : defaultPadding.right,
    };

    const bounds: Bounds = {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
    };

    return { padding, bounds, leftPaddingRef };
  }, [
    paddingLeft,
    paddingTop,
    measuredLeftPadding,
    isMounted,
    applySymmetricalPadding,
    width,
    height,
    leftPaddingRef,
  ]);
}
