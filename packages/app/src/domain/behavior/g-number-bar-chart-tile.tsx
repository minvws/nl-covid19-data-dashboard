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
import { rest } from 'lodash';

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
      g_number: 32.1,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-01-2020').getTime() / 1000,
      date_end_unix: new Date('01-08-2020').getTime() / 1000,
    },
    {
      g_number: -12.3,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-02-2020').getTime() / 1000,
      date_end_unix: new Date('01-09-2020').getTime() / 1000,
    },
    {
      g_number: 20,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-03-2020').getTime() / 1000,
      date_end_unix: new Date('01-10-2020').getTime() / 1000,
    },
    {
      g_number: 32.1,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-04-2020').getTime() / 1000,
      date_end_unix: new Date('01-11-2020').getTime() / 1000,
    },
    {
      g_number: -12.3,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-05-2020').getTime() / 1000,
      date_end_unix: new Date('01-12-2020').getTime() / 1000,
    },
    {
      g_number: 20,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-06-2020').getTime() / 1000,
      date_end_unix: new Date('01-13-2020').getTime() / 1000,
    },
    {
      g_number: 32.1,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-07-2020').getTime() / 1000,
      date_end_unix: new Date('01-14-2020').getTime() / 1000,
    },
  ];

  const last_value: NlVaccineDeliveryPerSupplierValue = {
    g_number: 20,
    date_of_insertion_unix: 0,
    date_start_unix: new Date('01-07-2020').getTime() / 1000,
    date_end_unix: new Date('01-14-2020').getTime() / 1000,
  };

  const simplifiedData = values.map(
    ({ date_start_unix, date_end_unix, ...rest }) => ({
      ...rest,
      date_unix: date_end_unix,
    })
  );

  return (
    <ChartTile
      title={text.title}
      description={text.description}
      metadata={{
        date: last_value.date_of_insertion_unix,
        // source: "source",
      }}
    >
      <ParentSize>
        {({ width }) => (
          <VerticalBarChart
            title="G Number"
            width={width}
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
                color: '#005082',
                label: 'lineee',
              },
            ]}
            formatTooltip={({ value }) =>
              `${formatPercentage(value.g_number)}% getaald`
            }
          />
        )}
      </ParentSize>
    </ChartTile>
  );
}
