import { Dispatch, SetStateAction } from 'react';
import { Box } from '~/components/base';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useViewport } from '~/utils/use-viewport';
import { TooltipSettings } from '../components/choropleth';

export type ChoroplethTooltipPlacement = 'bottom-right' | 'top-center';

type TTooltipProps = {
  left: number;
  top: number;
  setTooltip: Dispatch<SetStateAction<TooltipSettings | undefined>>;
  children: React.ReactNode;
  placement?: ChoroplethTooltipPlacement;
};

const VIEWPORT_PADDING = 10;

const padding = {
  left: 0,
  right: 0,
};

export function Tooltip({
  left,
  top,
  children,
  placement = 'bottom-right',
}: TTooltipProps) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 10 });
  const [ref, { width = 0, height = 0 }] = useResizeObserver<HTMLDivElement>();
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();

  /**
   * nudge the top to render the tooltip a little bit on top of the chart
   */
  let targetY = top + 20;
  let targetX = left + padding.left;

  if (placement === 'top-center') {
    targetY = top - height - 15;
    targetX = left - width / 2;
  }

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
