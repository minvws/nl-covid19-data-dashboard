import { useMemo } from 'react';
import { useIsMounted } from '~/utils/use-is-mounted';
import { Bounds, Padding } from './common';

const defaultPadding: Padding = {
  top: 10,
  right: 0,
  bottom: 30,
  /**
   * The left padding gives room for the Y-axis labels.
   * for server-side rendered charts we set it to 40px in order to support labels
   * up to 4 digits (4,000).
   * During run-time (client-side) the actual Y-axis width will be measured.
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
    const padding: Padding = {
      ...defaultPadding,
      left: isMounted
        ? paddingLeft ?? defaultPadding.left
        : defaultPadding.left,
    };

    const bounds: Bounds = {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
    };

    return { padding, bounds };
  }, [width, height, paddingLeft, isMounted]);
}
