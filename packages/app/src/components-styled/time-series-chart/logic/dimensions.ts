import { useMemo } from 'react';
import { Bounds, Padding } from './common';

const defaultPadding: Padding = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 30,
};

export function useDimensions(
  width: number,
  height: number,
  paddingLeft?: number
) {
  return useMemo(() => {
    const padding: Padding = {
      ...defaultPadding,
      left: paddingLeft ?? defaultPadding.left,
    };

    const bounds: Bounds = {
      width: width - padding.left - padding.right,
      height: height - padding.top - padding.bottom,
    };

    return { padding, bounds };
  }, [width, height, paddingLeft]);
}
