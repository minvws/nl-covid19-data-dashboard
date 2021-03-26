import { NlGNumber, NlGNumberValue } from '@corona-dashboard/common';
import { ParentSize } from '@visx/responsive';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { InlineText } from '~/components-styled/typography';
import { VerticalBarChart } from '~/components-styled/vertical-bar-chart';
import { useIntl } from '~/intl';
import { AllLanguages } from '~/locale';
import { colors } from '~/style/theme';
import { TimeframeOption } from '~/utils/timeframe';

function generateDummyData() {
  const data = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 5 * 7; ++i) {
    data.push({
      g_number: i % 3 === 0 ? -Math.random() * 40 : Math.random() * 40,
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
  // siteText,
  timeframeOptions = ['5weeks', 'week'],
}: GNumberBarChartTileProps) {
  const { formatPercentage } = useIntl();

  // const text = siteText.vaccinaties.grafiek_leveringen;
  const text = {
    title: 'Trend over time',
    description: 'Chart Description',
  };

  // Dummy Data
  const values: NlGNumberValue[] = generateDummyData();
  const last_value: NlGNumberValue = values[values.length - 1];

  return (
    <ChartTileWithTimeframe
      title={text.title}
      description={text.description}
      timeframeOptions={timeframeOptions}
      metadata={{
        date: last_value.date_of_insertion_unix,
        // source: 'source',
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
                  label: 'G Number',
                },
              ]}
              formatTooltip={({ value }) => {
                return (
                  <>
                    <InlineText fontWeight="bold">
                      {`${formatPercentage(value.g_number)}% `}
                    </InlineText>
                    getaald
                  </>
                );
              }}
            />
          )}
        </ParentSize>
      )}
    </ChartTileWithTimeframe>
  );
}
