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

  /**
   * Calculate the highest tick and round it up on the closet number on the 0.5 scales.
   * Then create an array with every tickStep till the highestTick
   * to use for the tickValues in the chart.
   */
  const tickStep = 0.5;

  const last_value = last(values) as NationalReproductionValue;
  const maxIndexAverage = Math.max(
    ...values.map((x) => x.index_average).filter(isPresent)
  );
  const highestTick = Math.ceil(maxIndexAverage * 2) / 2;

  const tickSteps = Array(highestTick / tickStep + 1)
    .fill(tickStep)
    .map((step, index) => index * step);

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
