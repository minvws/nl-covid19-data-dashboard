import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { isPresent } from 'ts-is-present';
import { last } from 'lodash';
import {
  NationalReproduction,
  NationalReproductionValue,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TimeframeOption } from '~/utils/timeframe';
import { assert } from '~/utils/assert';

interface ReproductionChartTileProps {
  data: NationalReproduction;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
}

export function ReproductionChartTile({
  data,
  timeframeOptions = ['all', '5weeks'],
  timeframeInitialValue = 'all',
}: ReproductionChartTileProps) {
  const { siteText } = useIntl();
  const text = siteText.reproductiegetal;

  /**
   * There is no data for the last 2 weeks so we are getting a slice
   * of all the values before the first datapoint with a null value to
   * display in the chart
   */
  const values = data.values.slice(
    0,
    data.values.findIndex((x) => !isPresent(x.index_average))
  );
  const last_value = last(values) as NationalReproductionValue;

  const findMaxAverage = values.reduce((prev, current) =>
    isPresent(prev.index_average) > isPresent(current.index_average)
      ? prev
      : current
  );

  const tickStep = 0.5;

  assert(
    findMaxAverage.index_average,
    "It coudn't find the highest average for the reproduction number"
  );

  const highestTick = Math.ceil(findMaxAverage.index_average * 2) / 2;

  const tickSteps = Array(highestTick / 0.5 + 1)
    .fill(tickStep)
    .map((v, i) => i * v);

  return (
    <ChartTile
      title={text.linechart_titel}
      description={text.legenda_r}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
      metadata={{
        date: last_value.date_of_insertion_unix,
        source: text.bronnen.rivm,
      }}
    >
      {(timeframe) => (
        <TimeSeriesChart
          values={values}
          timeframe={timeframe}
          seriesConfig={[
            {
              type: 'line',
              metricProperty: 'index_average',
              label: text.lineLegendLabel,
              color: colors.data.primary,
            },
          ]}
          dataOptions={{
            benchmark: {
              value: 1,
              label: siteText.common.signaalwaarde,
            },
          }}
          tickValues={tickSteps}
        />
      )}
    </ChartTile>
  );
}
