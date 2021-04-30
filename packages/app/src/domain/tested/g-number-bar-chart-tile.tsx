import { NlGNumber, VrGNumber } from '@corona-dashboard/common';
import { ChartTile } from '~/components/chart-tile';
import { InlineText } from '~/components/typography';
import { VerticalBarChart } from '~/components/vertical-bar-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { TimeframeOption } from '~/utils/timeframe';

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
      <VerticalBarChart
        ariaLabelledBy="chart_g_number"
        values={values}
        timeframe={timeframeInitialValue}
        numGridLines={3}
        dataOptions={{
          isPercentage: true,
        }}
        seriesConfig={[
          {
            type: 'bar',
            metricProperty: 'g_number',
            color: colors.red,
            secondaryColor: colors.data.primary,
          },
        ]}
        formatTooltip={({ value }) => {
          return (
            <>
              <InlineText fontWeight="bold">
                {`${formatPercentage(Math.abs(value.g_number))}% `}
              </InlineText>
              {value.g_number > 0
                ? text.positive_descriptor
                : text.negative_descriptor}
            </>
          );
        }}
      />
    </ChartTile>
  );
}
