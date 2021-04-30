/**
 * @TODO move these to more common location
 */
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { Bounds, Padding } from '../logic';

interface OverlayProps {
  bounds: Bounds;
  padding: Padding;
  children: ReactNode;
}

/**
 * The Overlay is an absolutely positioned container which spans the chart
 * surface in between the axes. It can be used to render things like markers
 * that need to render exactly in that space.
 */
export function Overlay({ bounds, padding, children }: OverlayProps) {
  return (
    <Box
      height={bounds.height}
      width={bounds.width}
      position="absolute"
      top={padding.top}
      left={padding.left}
      style={{
        pointerEvents: 'none',
      }}
    >
      {children}
    </Box>
  );
}
