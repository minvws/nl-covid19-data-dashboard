/**
 * The default tooltip `TooltipSeriesList` can now display the full contents of
 * the series config with colors and all, instead of a single default item.
 */
import { TimestampedValue } from '@corona-dashboard/common';
import { Bounds, Padding } from '../../logic';
import { TooltipSeriesList } from './tooltip-series-list';
import { TooltipWrapper } from './tooltip-wrapper';
import { TooltipData, TooltipFormatter } from './types';

interface TooltipProps<T extends TimestampedValue> {
  title?: string;
  data: TooltipData<T>;
  left: number;
  top: number;
  bounds: Bounds;
  padding: Padding;
  formatTooltip?: TooltipFormatter<T>;
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
  const content =
    typeof formatTooltip === 'function' ? (
      formatTooltip(tooltipData)
    ) : (
      <TooltipSeriesList data={tooltipData} />
    );

  if (!content) return null;

  return (
    <TooltipWrapper
      title={title}
      left={left}
      top={top}
      bounds={bounds}
      padding={padding}
    >
      {content}
    </TooltipWrapper>
  );
}
