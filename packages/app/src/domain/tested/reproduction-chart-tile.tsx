import { ChartTile } from '~/components/chart-tile';
import { colors, ArchivedNlReproduction, ArchivedNlReproductionValue } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { last } from 'lodash';
import { SiteText } from '~/locale';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { TimeSeriesChart } from '~/components/time-series-chart';

interface ReproductionChartTileProps {
  data: ArchivedNlReproduction;
  timelineEvents?: TimelineEventConfig[];
  text: SiteText['pages']['reproduction_page']['nl'];
}

export const ReproductionChartTile = ({ data, timelineEvents, text }: ReproductionChartTileProps) => {
  /**
   * There is no data for the last 2 weeks so we are getting a slice
   * of all the values before the first datapoint with a null value to
   * display in the chart
   */

  const values = data.values.slice(
    0,
    data.values.findIndex((x) => !isPresent(x.index_average))
  );
  const last_value = last(values) as ArchivedNlReproductionValue;

  const metadataDateOfInsertion = data.last_value.date_of_insertion_unix;

  return (
    <ChartTile
      title={text.linechart_titel}
      description={text.legenda_r}
      metadata={{
        source: text.bronnen.rivm,
        dateOfInsertion: metadataDateOfInsertion,
        timeframePeriod: last_value.date_of_insertion_unix,
        isArchived: true,
      }}
    >
      <TimeSeriesChart
        accessibility={{
          key: 'reproduction_line_chart',
        }}
        values={values}
        seriesConfig={[
          {
            type: 'line',
            metricProperty: 'index_average',
            label: text.linechart_legend_label,
            shortLabel: text.linechart_tooltip_label,
            color: colors.primary,
          },
        ]}
        dataOptions={{
          timelineEvents,
        }}
        numGridLines={4}
        forceLegend
      />
    </ChartTile>
  );
};
