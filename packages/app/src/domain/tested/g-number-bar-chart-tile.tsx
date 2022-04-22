import {
  colors,
  NlGNumber,
  TimeframeOption,
  TimeframeOptionsList,
  VrGNumber,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesListContainer } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-container';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';

interface GNumberBarChartTileProps {
  data: NlGNumber | VrGNumber;
  timeframeInitialValue?: TimeframeOption;
}

export function GNumberBarChartTile({
  data: __data,
  timeframeInitialValue = TimeframeOption.ALL,
}: GNumberBarChartTileProps) {
  const { formatPercentage, commonTexts } = useIntl();

  const text = commonTexts.g_number.bar_chart;

  const values = __data.values;
  const last_value = __data.last_value;

  return (
    <ChartTile
      title={text.title}
      description={text.description}
      timeframeInitialValue={timeframeInitialValue}
      timeframeOptions={TimeframeOptionsList}
      metadata={{
        date: last_value.date_of_insertion_unix,
        source: text.bronnen,
      }}
    >
      {(timeframe) => (
        <TimeSeriesChart
          accessibility={{
            key: 'g_number',
            features: ['keyboard_bar_chart'],
          }}
          values={
            /**
             * @TODO the two `g_number`-schema's needs to be updated from
             * date-span-value to date-value:
             *
             *     - "date_start_unix": { "type": "integer" },
             *     - "date_end_unix": { "type": "integer" },
             *     + "date_unix": { "type": "integer" },
             *
             * After this schema change we can also get rid of the following map:
             */
            values.map((x) => ({
              date_of_insertion_unix: x.date_of_insertion_unix,
              g_number: x.g_number,
              date_unix: x.date_end_unix,
            }))
          }
          timeframe={timeframe}
          dataOptions={{
            isPercentage: true,
            timespanAnnotations: [
              {
                start: values[0].date_end_unix,
                end: new Date('1 April 2020').getTime() / 1000,
                label: text.legend_inaccurate_label,
                shortLabel: commonTexts.common.incomplete,
              },
            ],
          }}
          disableLegend
          seriesConfig={[
            {
              type: 'split-bar',
              metricProperty: 'g_number',
              label: 'G number',
              fillOpacity: 1,
              splitPoints: [
                {
                  color: colors.data.primary,
                  value: 0,
                  label: '', // legend is hidden, we can leave this empty
                },
                {
                  color: colors.red,
                  value: Infinity,
                  label: '', // legend is hidden, we can leave this empty
                },
              ],
            },
          ]}
          formatTooltip={(data) => (
            <TooltipSeriesListContainer {...data}>
              <BoldText>
                {`${formatPercentage(Math.abs(data.value.g_number))}% `}
              </BoldText>
              {data.value.g_number > 0
                ? text.positive_descriptor
                : text.negative_descriptor}
            </TooltipSeriesListContainer>
          )}
        />
      )}
    </ChartTile>
  );
}
