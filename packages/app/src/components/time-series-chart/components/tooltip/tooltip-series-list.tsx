import { TimestampedValue } from '@corona-dashboard/common';
import { TooltipSeriesListContainer } from './tooltip-series-list-container';
import { TooltipSeriesListItems } from './tooltip-series-list-items';
import { TooltipData } from './types';

interface TooltipSeriesListProps<T extends TimestampedValue> {
  data: TooltipData<T>;
  hasTwoColumns?: boolean;
}

export function TooltipSeriesList<T extends TimestampedValue>({
  data,
  hasTwoColumns,
}: TooltipSeriesListProps<T>) {
  return (
    <TooltipSeriesListContainer {...data}>
      <TooltipSeriesListItems hasTwoColumns={hasTwoColumns} {...data} />
    </TooltipSeriesListContainer>
  );
}
