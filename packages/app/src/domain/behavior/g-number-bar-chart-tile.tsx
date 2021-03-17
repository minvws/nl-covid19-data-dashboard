import {
  NlVaccineDeliveryPerSupplier,
  NlVaccineDeliveryPerSupplierValue,
} from '@corona-dashboard/common';
import { ParentSize } from '@visx/responsive';
import { ChartTile } from '~/components-styled/chart-tile';
import { VerticalBarChart } from '~/components-styled/vertical-bar-chart';
import { AllLanguages } from '~/locale/APP_LOCALE';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatPercentage } from '~/utils/formatNumber';

interface GNumberBarChartTileProps {
  data: NlVaccineDeliveryPerSupplier;
  siteText: AllLanguages;
}

export function GNumberBarChartTile({
  data: __data,
  siteText,
}: GNumberBarChartTileProps) {
  // const text = siteText.vaccinaties.grafiek_leveringen;
  const text = {
    title: 'Trend over time',
    description: 'blah blah blah',
  };

  const values: NlVaccineDeliveryPerSupplierValue[] = [
    {
      g_number: 0.321,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-01-2020').getTime() / 1000,
      date_end_unix: new Date('01-08-2020').getTime() / 1000,
    },
    {
      g_number: -0.123,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-02-2020').getTime() / 1000,
      date_end_unix: new Date('01-09-2020').getTime() / 1000,
    },
    {
      g_number: 0.2,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-03-2020').getTime() / 1000,
      date_end_unix: new Date('01-10-2020').getTime() / 1000,
    },
    {
      g_number: 0.321,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-04-2020').getTime() / 1000,
      date_end_unix: new Date('01-11-2020').getTime() / 1000,
    },
    {
      g_number: -0.123,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-05-2020').getTime() / 1000,
      date_end_unix: new Date('01-12-2020').getTime() / 1000,
    },
    {
      g_number: 0.2,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('02-06-2020').getTime() / 1000,
      date_end_unix: new Date('02-13-2020').getTime() / 1000,
    },
  ];

  const last_value: NlVaccineDeliveryPerSupplierValue = {
    g_number: 0.2,
    date_of_insertion_unix: 0,
    date_start_unix: new Date('02-06-2020').getTime() / 1000,
    date_end_unix: new Date('02-13-2020').getTime() / 1000,
  };

  return (
    <ChartTile
      title={replaceVariablesInText(text.title, {
        weekNumber: last_value.week_number,
      })}
      description={text.description}
      metadata={{
        date: last_value.date_of_report_unix,
        // source: "source",
      }}
    >
      <ParentSize>
        {({ width }) => (
          <VerticalBarChart
            title="G Number"
            width={width}
            ariaLabelledBy="chart_g_number"
            values={values}
            showDateMarker
            numGridLines={3}
            tickValues={[-0.5, 0, 0.5]}
            dataOptions={{
              isPercentage: true,
              // forcedMaximumValue: 100,
            }}
            seriesConfig={[
              {
                type: 'line',
                metricProperty: 'g_number',
                color: '#005082',
                label: 'lineee',
              },
            ]}
            formatTooltip={({ value }) =>
              `${formatPercentage(value.g_number)} getaald`
            }
          />
        )}
      </ParentSize>
    </ChartTile>
  );
}
