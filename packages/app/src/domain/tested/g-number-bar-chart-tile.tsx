import {
  colors,
  NlGNumber,
  TimeframeOption,
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
  timeframeInitialValue = TimeframeOption.FIRST_OF_SEPTEMBER,
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
      timeframeOptions={[
        TimeframeOption.FIRST_OF_SEPTEMBER,
        TimeframeOption.ONE_WEEK,
        TimeframeOption.THIRTY_DAYS,
        TimeframeOption.THREE_MONTHS,
        TimeframeOption.SIX_MONTHS,
        TimeframeOption.LAST_YEAR,
      ]}
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
          values={values}
          timeframe={timeframe}
          dataOptions={{
            isPercentage: true,
          }}
          seriesConfig={[
            {
              type: 'split-bar',
              metricProperty: 'g_number',
              label: '',
              fillOpacity: 1,
              splitPoints: [
                {
                  color: colors.data.primary,
                  value: 0,
                  label: text.legend.negative_label,
                },
                {
                  color: colors.red,
                  value: Infinity,
                  label: text.legend.positive_label,
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
