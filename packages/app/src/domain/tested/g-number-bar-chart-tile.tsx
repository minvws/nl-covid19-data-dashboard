import { colors, ArchivedNlGNumber, TimeframeOption, TimeframeOptionsList } from '@corona-dashboard/common';
import { useState } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TooltipSeriesListContainer } from '~/components/time-series-chart/components/tooltip/tooltip-series-list-container';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { createDateFromUnixTimestamp } from '~/utils/create-date-from-unix-timestamp';

interface GNumberBarChartTileProps {
  data: ArchivedNlGNumber;
  timeframeInitialValue?: TimeframeOption;
}

export function GNumberBarChartTile({ data: __data, timeframeInitialValue = TimeframeOption.ALL }: GNumberBarChartTileProps) {
  const [gnumberTimeframe, setGnumberTimeframe] = useState<TimeframeOption>(TimeframeOption.ALL);

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
      timeframeInitialValue={timeframeInitialValue}
      timeframeOptions={TimeframeOptionsList}
      metadata={{
        date: last_value.date_of_insertion_unix,
        source: text.bronnen,
      }}
      onSelectTimeframe={setGnumberTimeframe}
    >
      <TimeSeriesChart
        accessibility={{
          key: 'g_number',
          features: ['keyboard_bar_chart'],
        }}
        values={values}
        endDate={endDate}
        timeframe={gnumberTimeframe}
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
