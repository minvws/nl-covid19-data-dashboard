import {
  NlGNumber,
  TimeframeOption,
  VrGNumber,
} from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

interface GNumberBarChartTileProps {
  data: NlGNumber | VrGNumber;
  timeframeInitialValue?: TimeframeOption;
}

export function GNumberBarChartTile({
  data: __data,
  timeframeInitialValue = '5weeks',
}: GNumberBarChartTileProps) {
  const { formatPercentage, siteText } = useIntl();

  const text = siteText.g_number.bar_chart;

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
        values={values}
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
                label: 'Krimpend G-getal',
              },
              {
                color: colors.red,
                label: 'Groeiend G-getal',
                value: Infinity,
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
