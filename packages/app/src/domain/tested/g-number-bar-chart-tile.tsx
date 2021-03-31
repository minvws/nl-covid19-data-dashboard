import { NlGNumber, VrGNumber } from '@corona-dashboard/common';
import { ChartTile } from '~/components-styled/chart-tile';
import { InlineText } from '~/components-styled/typography';
import { VerticalBarChart } from '~/components-styled/vertical-bar-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { TimeframeOption } from '~/utils/timeframe';

interface GNumberBarChartTileProps {
  data: NlGNumber | VrGNumber;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
}

export function GNumberBarChartTile({
  data: __data,
}: GNumberBarChartTileProps) {
  const { formatPercentage, siteText } = useIntl();

  const text = siteText.g_number.bar_chart;

  const values = __data.values;
  const last_value = __data.last_value;

  return (
    <ChartTile
      title={text.title}
      description={text.description}
      metadata={{
        date: last_value.date_of_insertion_unix,
        source: text.bronnen,
      }}
    >
      <VerticalBarChart
        timeframe={'5weeks'}
        ariaLabelledBy="chart_g_number"
        values={values}
        numGridLines={3}
        dataOptions={{
          isPercentage: true,
        }}
        seriesConfig={[
          {
            type: 'bar',
            metricProperty: 'g_number',
            color: colors.data.primary,
            secondaryColor: colors.red,
          },
        ]}
        formatTooltip={({ value }) => {
          return (
            <>
              <InlineText fontWeight="bold">
                {`${formatPercentage(value.g_number)}% `}
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
