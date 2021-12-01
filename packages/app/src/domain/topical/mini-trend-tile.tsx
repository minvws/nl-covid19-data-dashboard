import { TimeframeOption, TimestampedValue } from '@corona-dashboard/common';
import { ErrorBoundary } from '~/components/error-boundary';
import { MiniTrendChart } from '~/components/mini-trend-chart';
import { SeriesConfig } from '~/components/time-series-chart';
import { DataOptions } from '~/components/time-series-chart/logic';
import { AccessibilityDefinition } from '~/utils/use-accessibility-annotations';
import { MiniTile, MiniTileProps } from './mini-tile';

type MiniTrendTileProps<T extends TimestampedValue = TimestampedValue> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  timeframe?: TimeframeOption;
  seriesConfig: SeriesConfig<T>;
  dataOptions?: DataOptions;
  values: T[];
  hideLeftMargin?: boolean
} & Omit<MiniTileProps, 'children'>;

export function MiniTrendTile<T extends TimestampedValue>(
  props: MiniTrendTileProps<T>
) {
  const {
    accessibility,
    timeframe = '5weeks',
    values,
    seriesConfig,
    dataOptions,
    hideLeftMargin,
    ...tileProps
  } = props;

  return (
    <MiniTile {...tileProps} hideLeftMargin={hideLeftMargin}>
      <div>
        <ErrorBoundary>
          <MiniTrendChart
            accessibility={accessibility}
            timeframe={timeframe}
            title={tileProps.title}
            values={values}
            seriesConfig={seriesConfig}
            dataOptions={dataOptions}
          />
        </ErrorBoundary>
      </div>
    </MiniTile>
  );
}
