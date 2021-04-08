import { useMemo } from 'react';
import { useIsMounted } from '~/utils/use-is-mounted';
import { Bounds, Padding } from './common';

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

export function useDimensions(
  width: number,
  height: number,
  paddingLeft?: number
) {
  const isMounted = useIsMounted();

  return useMemo(() => {
    /**
     * When there's a padding left set/measured we'll add 10px extra to give the
     * y-axis labels a bit more space, otherwise they could be cut off.
     */
    const paddingLeftWithExtraSpace = paddingLeft
      ? paddingLeft + 10
      : paddingLeft;

    const padding: Padding = {
      ...defaultPadding,
      left: isMounted
        ? paddingLeftWithExtraSpace ?? defaultPadding.left
        : defaultPadding.left,
    };

    const bounds: Bounds = {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
    };

    return { padding, bounds };
  }, [width, height, paddingLeft, isMounted]);
}
