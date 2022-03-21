import {
  colors,
  NlGNumber,
  TimeframeOption,
  VrGNumber,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';

interface GNumberBarChartTileProps {
  data: NlGNumber | VrGNumber;
  timeframeInitialValue?: TimeframeOption;
}

export function GNumberBarChartTile({
  data: __data,
  timeframeInitialValue = TimeframeOption.FIVE_WEEKS,
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
      metadata={{
        date: last_value.date_of_insertion_unix,
        source: text.bronnen,
      }}
    >
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
        timeframe={timeframeInitialValue}
        dataOptions={{
          isPercentage: true,
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
        formatTooltip={({ value }) => (
          <>
            <InlineText fontWeight="bold">
              {`${formatPercentage(Math.abs(value.g_number))}% `}
            </InlineText>
            {value.g_number > 0
              ? text.positive_descriptor
              : text.negative_descriptor}
          </>
        )}
      />
    </ChartTile>
  );
}
