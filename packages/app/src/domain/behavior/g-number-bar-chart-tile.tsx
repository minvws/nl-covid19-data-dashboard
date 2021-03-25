import { NlGNumber, NlGNumberValue } from '@corona-dashboard/common';
import { ParentSize } from '@visx/responsive';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { TimeframeOption } from '~/utils/timeframe';
import { VerticalBarChart } from '~/components-styled/vertical-bar-chart';
import { AllLanguages } from '~/locale/APP_LOCALE';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useIntl } from '~/intl';
import { rest } from 'lodash';

function generateDummyData() {
  const data = [];
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 5 * 7; ++i) {
    data.push({
      g_number: i % 3 === 0 ? -Math.random() * 50 : Math.random() * 50,
      date_of_insertion_unix: 0,
      date_start_unix: new Date(currentDate.getTime() - 7).getTime() / 1000,
      date_end_unix: currentDate.getTime() / 1000,
    });

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return data.reverse();
}

interface GNumberBarChartTileProps {
  data: NlGNumber;
  siteText: AllLanguages;
  timeframeOptions?: TimeframeOption[];
}

export function GNumberBarChartTile({
  data: __data,
  siteText,
  timeframeOptions = ['5weeks', 'week'],
}: GNumberBarChartTileProps) {
  const { formatPercentage } = useIntl();

  // const text = siteText.vaccinaties.grafiek_leveringen;
  const text = {
    title: 'Trend over time',
    description: 'blah blah blah',
  };

  const values: NlGNumberValue[] = generateDummyData();

  const last_value: NlGNumberValue = values[values.length - 1];

  const simplifiedData = values.map(
    ({ date_start_unix, date_end_unix, ...rest }) => ({
      ...rest,
      date_unix: date_end_unix,
    })
  );

  return (
    <ChartTileWithTimeframe
      title={text.title}
      description={text.description}
      timeframeOptions={timeframeOptions}
      metadata={{
        date: last_value.date_of_insertion_unix,
        // source: "source",
      }}
    >
      {(timeframe) => (
        <ParentSize>
          {({ width }) => (
            <VerticalBarChart
              title="G Number"
              width={width}
              timeframe={timeframe}
              ariaLabelledBy="chart_g_number"
              values={simplifiedData}
              showDateMarker
              numGridLines={3}
              tickValues={[-50, 0, 50]}
              dataOptions={{
                isPercentage: true,
              }}
              seriesConfig={[
                {
                  type: 'bar',
                  metricProperty: 'g_number',
                  color: colors.data.primary,
                  secondaryColor: colors.red,
                  label: 'lineee',
                },
              ]}
              formatTooltip={({ value }) =>
                `${formatPercentage(value.g_number)}% getaald`
              }
            />
          )}
        </ParentSize>
      )}
    </ChartTileWithTimeframe>
  );
}
