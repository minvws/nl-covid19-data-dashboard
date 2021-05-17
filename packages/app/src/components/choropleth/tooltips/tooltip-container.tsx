import { Dispatch, SetStateAction, useRef } from 'react';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useViewport } from '~/utils/use-viewport';
import { TooltipSettings } from '../choropleth';

type TTooltipProps = {
  left: number;
  top: number;
  setTooltip: Dispatch<SetStateAction<TooltipSettings | undefined>>;
  children: React.ReactNode;
};

const VIEWPORT_PADDING = 10;

const padding = {
  left: 0,
  right: 0,
};

export function Tooltip({ left, top, children }: TTooltipProps) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 10 });
  const ref = useRef<HTMLDivElement>(null);
  const { width = 0 } = useResizeObserver<HTMLDivElement>({ ref });
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  /**
   * nudge the top to render the tooltip a little bit on top of the chart
   */
  const targetY = top + 20;
  const targetX = left + padding.left;

  const maxWidth = Math.min(400, viewportSize.width - VIEWPORT_PADDING * 2);

  const relativeLeft = boundingBox?.left ?? 0;

  const minLeft = -relativeLeft + VIEWPORT_PADDING;
  const maxLeft = viewportSize.width - width - relativeLeft - VIEWPORT_PADDING;

  const y = targetY;
  const x = Math.max(
    minLeft, // stay within left side of viewport
    Math.min(
      targetX, // center tooltip
      maxLeft // stay within right side of viewport
    )
  );

  return (
    <div ref={boundingBoxRef}>
      <Box
        bg="white"
        position="absolute"
        ref={ref}
        style={{
          top: 0,
          left: 0,
          opacity: isMounted ? 1 : 0,
          transform: `translate(${Math.round(x)}px,${Math.round(y)}px)`,
          maxWidth,
        }}
        boxShadow="rgba(33, 33, 33, 0.2) 0px 1px 2px"
        borderRadius={1}
        zIndex={1000}
      >
        {children}
      </Box>
    </div>
  );
}
