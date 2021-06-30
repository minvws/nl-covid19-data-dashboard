import {
  NationalReproduction,
  NationalReproductionValue,
  TimeframeOption,
} from '@corona-dashboard/common';
import { last } from 'lodash';
import { isPresent } from 'ts-is-present';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

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
          accessibility={{
            key: 'reproduction_line_chart',
          }}
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
          numGridLines={timeframe === 'all' ? 4 : 3}
        />
      )}
    </ChartTile>
  );
}
