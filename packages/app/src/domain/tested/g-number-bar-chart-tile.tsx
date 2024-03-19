import { BoldText } from '~/components/typography';
import { ChartTile } from '~/components/chart-tile';
import { colors, ArchivedNlGNumber } from '@corona-dashboard/common';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesListContainer } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-container';
import { useIntl } from '~/intl';

interface GNumberBarChartTileProps {
  data: ArchivedNlGNumber;
}

export function GNumberBarChartTile({ data: __data }: GNumberBarChartTileProps) {
  const { formatPercentage, commonTexts } = useIntl();
  const text = commonTexts.g_number.bar_chart;

  const firstOfSeptember2020Unix = new Date('1 September 2020').valueOf() / 1000;
  const values = __data.values.filter((value) => {
    return value.date_unix >= firstOfSeptember2020Unix;
  });
  const last_value = __data.last_value;
  const endDate = createDateFromUnixTimestamp(last_value.date_unix);

  return (
    <ChartTile
      title={text.title}
      description={text.description}
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
        endDate={endDate}
        seriesConfig={[
          {
            type: 'split-bar',
            metricProperty: 'g_number',
            label: '',
            fillOpacity: 1,
            splitPoints: [
              {
                color: colors.primary,
                value: 0,
                label: text.legend.negative_label,
              },
              {
                color: colors.red2,
                value: Infinity,
                label: text.legend.positive_label,
              },
            ],
          },
        ]}
        formatTooltip={(data) => (
          <TooltipSeriesListContainer {...data}>
            <BoldText>{`${formatPercentage(Math.abs(data.value.g_number))}% `}</BoldText>
            {data.value.g_number > 0 ? text.positive_descriptor : text.negative_descriptor}
          </TooltipSeriesListContainer>
        )}
      />
    </ChartTile>
  );
}
