import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useBoundingBox } from '~/utils/use-bounding-box';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useViewport } from '~/utils/use-viewport';
import { ChoroplethDataItem } from '../logic';
import { ChoroplethTooltip } from './choropleth-tooltip';
import { TooltipData, TooltipFormatter } from './types';

export type ChoroplethTooltipPlacement = 'bottom-right' | 'top-center';

type TTooltipProps<T extends ChoroplethDataItem> = {
  left: number;
  top: number;
  placement?: ChoroplethTooltipPlacement;
  formatTooltip?: TooltipFormatter<T>;
  data: TooltipData<T>;
  dataFormatters?: Partial<Record<keyof T, (input: string | number) => string>>;
};

const VIEWPORT_PADDING = 10;

const padding = {
  top: 12,
};

export function Tooltip<T extends ChoroplethDataItem>({ left, top, formatTooltip, data, dataFormatters, placement = 'bottom-right' }: TTooltipProps<T>) {
  const viewportSize = useViewport();
  const isMounted = useIsMounted({ delayMs: 10 });
  const [ref, { height = 0 }] = useResizeObserver<HTMLDivElement>();
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();
  const isTouch = useIsTouchDevice();

  const content = isDefined(formatTooltip) ? formatTooltip(data) : <ChoroplethTooltip data={data} dataFormatters={dataFormatters} />;

  if (!content) return null;

  const maxWidth = Math.min(400, viewportSize.width - VIEWPORT_PADDING * 2);

  const minx = 0;
  const maxx = boundingBox?.width ?? 400;
  const maxy = viewportSize.height ?? 480;

  const t = (placement: ChoroplethTooltipPlacement, top: number, left: number): string => {
    switch (placement) {
      case 'top-center': {
        const xt = (current: number) => Math.round((100 * (current - minx)) / (maxx - minx));
        return `translateX(-${xt(left)}%)`;
      }
      case 'bottom-right':
      default: {
        const xt = (current: number) => Math.round((100 * (current - minx)) / (maxx - minx));
        const yt = (current: number) => Math.round(current > maxy / 2 ? -(height + padding.top) : padding.top);
        const bboxTop = boundingBox?.top ?? 0;
        return `translate(-${xt(left)}%, ${yt(bboxTop + top)}px)`;
      }
    }
  };

  return (
    <Box ref={boundingBoxRef} position="absolute" top="0" left="0" width="100%" height="100%">
      <Box position="absolute" style={{ top, left, width: '1px', height: '1px' }}>
        <Box
          bg="white"
          ref={ref}
          style={{
            position: 'absolute',
            bottom: placement === 'top-center' ? padding.top + 'px' : 'auto',
            opacity: isMounted ? 1 : 0,
            transform: t(placement, top, left),
            maxWidth,
            pointerEvents: isTouch ? 'all' : 'none',
          }}
          boxShadow="rgba(33, 33, 33, 0.2) 0px 1px 2px"
          borderRadius={1}
          zIndex={1000}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
}
