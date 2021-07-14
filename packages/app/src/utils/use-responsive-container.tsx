import { ReactNode, useCallback } from 'react';
import { Box } from '~/components/base';
import { useResizeObserver } from './use-resize-observer';

/**
 * Hook returning a component which will fill to available width and height of
 * the parent container.
 * Additionally it returns the measured width and height of the component.
 *
 * @param initialWidth the initial width will be used server-side. Client side
 * this will be set to the available width defined by the parent.
 * @param minHeight the min height will define a minimal height of the
 * container. Client side this may become larger when the parent component gives
 * more height.
 */
export function useResponsiveContainer(initialWidth: number, minHeight = 0) {
  const {
    height: measuredHeight = minHeight,
    width: measuredWidth = initialWidth,
    ref,
  } = useResizeObserver<HTMLDivElement>();

  const width = Math.floor(measuredWidth);
  const height = Math.floor(Math.max(measuredHeight, minHeight));

  /**
   * Do NOT change the `style={{ height }}` to `height={height}` since
   * this will lead to countless runtime classes being generated.
   */
  const ResponsiveContainer = useCallback(
    ({
      children,
      height = '100%',
    }: {
      children: ReactNode;
      height?: string | number;
    }) => (
      <Box ref={ref} height="100%" minHeight={minHeight} position="relative">
        <Box position="absolute" width="100%" style={{ height }}>
          {children}
        </Box>
      </Box>
    ),
    [ref, minHeight]
  );

  return { width, height, ResponsiveContainer, ref };
}
