import { TimestampedValue } from '@corona-dashboard/common';
import { Bounds, Padding } from '~/components-styled/time-series-chart/logic';
import { TooltipData, TooltipFormatter } from './types';
import { TooltipWrapper } from '~/components-styled/time-series-chart/components/tooltip/tooltip-wrapper';

interface TooltipProps<T extends TimestampedValue> {
  title?: string;
  data: TooltipData<T>;
  left: number;
  top: number;
  bounds: Bounds;
  padding: Padding;
  formatTooltip: TooltipFormatter<T>;
}

export function Tooltip<T extends TimestampedValue>({
  title,
  data: tooltipData,
  left,
  top,
  formatTooltip,
  bounds,
  padding,
}: TooltipProps<T>) {
  return (
    <TooltipWrapper
      title={title}
      left={left}
      top={top}
      bounds={bounds}
      padding={padding}
    >
      {formatTooltip(tooltipData)}
    </TooltipWrapper>
  );
}
