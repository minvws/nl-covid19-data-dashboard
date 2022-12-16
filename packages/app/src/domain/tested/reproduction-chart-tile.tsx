import { colors, NlReproduction, NlReproductionValue, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { last } from 'lodash';
import { isPresent } from 'ts-is-present';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { SiteText } from '~/locale';
import { metricConfigs } from '~/metric-config';

interface ReproductionChartTileProps {
  data: NlReproduction;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  timelineEvents?: TimelineEventConfig[];
  text: SiteText['pages']['reproduction_page']['nl'];
}

export function ReproductionChartTile({
  data,
  timeframeOptions = TimeframeOptionsList,
  timeframeInitialValue = TimeframeOption.ALL,
  timelineEvents,
  text,
}: ReproductionChartTileProps) {
  /**
   * There is no data for the last 2 weeks so we are getting a slice
   * of all the values before the first datapoint with a null value to
   * display in the chart
   */

  const [reproductionTimeframe, setReproductionTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

  const values = data.values.slice(
    0,
    data.values.findIndex((x) => !isPresent(x.index_average))
  );
  const last_value = last(values) as NlReproductionValue;

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
      onSelectTimeframe={setReproductionTimeframe}
    >
      <TimeSeriesChart
        accessibility={{
          key: 'reproduction_line_chart',
        }}
        values={values}
        timeframe={reproductionTimeframe}
        seriesConfig={[
          {
            type: 'line',
            metricProperty: 'index_average',
            label: text.lineLegendLabel,
            color: colors.primary,
            minimumRange: metricConfigs?.nl?.reproduction?.index_average?.minimumRange,
          },
        ]}
        dataOptions={{
          timelineEvents,
        }}
        numGridLines={reproductionTimeframe === TimeframeOption.ALL ? 4 : 3}
        forceLegend
      />
    </ChartTile>
  );
}
