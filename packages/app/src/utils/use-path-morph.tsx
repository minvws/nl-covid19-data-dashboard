import { interpolatePath } from 'd3-interpolate-path';
import { animate, MotionValue, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

/**
 * By default framer-motion does not support _morphing_ svg paths, it can only
 * tween shapes with an equal amount of "points".
 * The following hook implements a custom interpolator to achieve morphing
 * complex shapes.
 *
 * source:
 * https://github.com/framer/motion/issues/451#issuecomment-761302824
 */
export function usePathMorph(
  d: string,
  config?: Parameters<typeof animate>[2]
): MotionValue<string> {
  const value = useMotionValue<string>(d);

  useEffect(() => {
    const interpolator = interpolatePath(value.get(), d);

    animate(0, 1, {
      ...config,
      onUpdate: (progress) => value.set(interpolator(progress)),
    });
  }, [d, value, config]);

  return value;
}
