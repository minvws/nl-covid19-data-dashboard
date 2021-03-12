import {
  NlVaccineDeliveryPerSupplier,
  NlVaccineDeliveryPerSupplierValue,
} from '@corona-dashboard/common';
import { ParentSize } from '@visx/responsive';
import { ChartTile } from '~/components-styled/chart-tile';
import { StackedChart } from '~/components-styled/stacked-chart';
import { AllLanguages } from '~/locale/APP_LOCALE';
import { colors } from '~/style/theme';

interface VaccineDeliveryBarChartProps {
  data: NlVaccineDeliveryPerSupplier;
  siteText: AllLanguages;
}

export function VaccineDeliveryBarChart({
  data: __data,
  siteText,
}: VaccineDeliveryBarChartProps) {
  const text = siteText.vaccinaties.grafiek_leveringen;

  const values: NlVaccineDeliveryPerSupplierValue[] = [
    {
      total: 23456,
      bio_n_tech_pfizer: 1234,
      moderna: 856,
      astra_zeneca: 500,
      is_estimate: false,
      week_number: 1,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-01-2020').getTime() / 1000,
      date_end_unix: new Date('01-08-2020').getTime() / 1000,
      date_of_report_unix: 0,
    },
    {
      total: 5456,
      bio_n_tech_pfizer: 2345,
      moderna: 500,
      astra_zeneca: 1490,
      is_estimate: false,
      week_number: 2,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-09-2020').getTime() / 1000,
      date_end_unix: new Date('01-16-2020').getTime() / 1000,
      date_of_report_unix: 0,
    },
    {
      total: 126,
      bio_n_tech_pfizer: 1265,
      moderna: 2314,
      astra_zeneca: 1789,
      is_estimate: false,
      week_number: 3,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-17-2020').getTime() / 1000,
      date_end_unix: new Date('01-24-2020').getTime() / 1000,
      date_of_report_unix: 0,
    },
    {
      total: 23456,
      bio_n_tech_pfizer: 1234,
      moderna: 856,
      astra_zeneca: 500,
      is_estimate: true,
      week_number: 4,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('01-25-2020').getTime() / 1000,
      date_end_unix: new Date('01-31-2020').getTime() / 1000,
      date_of_report_unix: 0,
    },
    {
      total: 5456,
      bio_n_tech_pfizer: 2345,
      moderna: 500,
      astra_zeneca: 1490,
      is_estimate: true,
      week_number: 5,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('02-01-2020').getTime() / 1000,
      date_end_unix: new Date('02-07-2020').getTime() / 1000,
      date_of_report_unix: 0,
    },
    {
      total: 126,
      bio_n_tech_pfizer: 1265,
      moderna: 2314,
      astra_zeneca: 1789,
      is_estimate: true,
      week_number: 6,
      date_of_insertion_unix: 0,
      date_start_unix: new Date('02-08-2020').getTime() / 1000,
      date_end_unix: new Date('02-14-2020').getTime() / 1000,
      date_of_report_unix: 0,
    },
  ];

  const last_value: NlVaccineDeliveryPerSupplierValue = {
    total: 126,
    bio_n_tech_pfizer: 1265,
    moderna: 2314,
    astra_zeneca: 1789,
    is_estimate: false,
    week_number: 6,
    date_of_insertion_unix: 0,
    date_start_unix: new Date('02-08-2020').getTime() / 1000,
    date_end_unix: new Date('02-14-2020').getTime() / 1000,
    date_of_report_unix: new Date('02-16-2020').getTime() / 1000,
  };

  return (
    <ChartTile
      title={text.titel}
      description={text.omschrijving}
      metadata={{
        date: last_value.date_of_report_unix,
        source: siteText.vaccinaties.bronnen.rivm,
      }}
    >
      <ParentSize>
        {({ width }) => (
          <StackedChart
            width={width}
            values={values}
            config={[
              {
                metricProperty: 'bio_n_tech_pfizer',
                color: colors.data.vaccines.bio_n_tech_pfizer,
                label: 'BioNTech/Pfizer',
              },
              {
                metricProperty: 'moderna',
                color: colors.data.vaccines.moderna,
                label: 'Moderna',
              },
              {
                metricProperty: 'astra_zeneca',
                color: colors.data.vaccines.astra_zeneca,
                label: 'AstraZeneca',
              },
            ]}
          />
        )}
      </ParentSize>
    </ChartTile>
  );
}
