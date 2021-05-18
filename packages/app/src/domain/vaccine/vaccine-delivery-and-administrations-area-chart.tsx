import { assert } from '@corona-dashboard/common';
import { first } from 'lodash';
import { useMemo } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { StackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { VaccineDeliveryAndAdministrationsTooltip } from './components/vaccine-delivery-and-administrations-tooltip';
import {
  DeliveryAndAdministrationData,
  VaccineDeliveryAndAdministrationsValue,
} from './data-selection/select-delivery-and-administration-data';

const vaccines = [
  'pfizer',
  'moderna',
  'astra_zeneca',
  'cure_vac',
  'janssen',
  'sanofi',
] as (keyof Pick<
  VaccineDeliveryAndAdministrationsValue,
  'pfizer' | 'moderna' | 'astra_zeneca' | 'cure_vac' | 'janssen' | 'sanofi'
>)[];

vaccines.forEach((x) =>
  assert(colors.data.vaccines[x], `missing vaccine color for vaccine ${x}`)
);

export function VaccineDeliveryAndAdministrationsAreaChart({
  data,
}: {
  data: DeliveryAndAdministrationData;
}) {
  const { siteText, formatNumber } = useIntl();
  const firstValue = first(data.values);
  const vaccineNames = useMemo(
    () =>
      vaccines
        .filter((x) => firstValue && firstValue[x] !== undefined)
        .reverse(),
    [vaccines, firstValue]
  );

  const productNames =
    siteText.vaccinaties.data.vaccination_chart.product_names;

  return (
    <ChartTile
      title={siteText.vaccinaties.grafiek.titel}
      description={siteText.vaccinaties.grafiek.omschrijving}
      metadata={{
        date: firstValue?.date_of_report_unix,
        source: siteText.vaccinaties.bronnen.rivm,
      }}
    >
      <TimeSeriesChart
        dataOptions={{
          valueAnnotation: siteText.waarde_annotaties.x_miljoen,
          timespanAnnotations: [
            {
              type: 'hatched',
              start: data.estimatedRange[0],
              end: data.estimatedRange[1],
              label:
                siteText.vaccinaties.data.vaccination_chart.legend.expected,
            },
            {
              type: 'divider',
              start: data.estimatedRange[0],
              end: data.estimatedRange[1],
              leftLabel:
                siteText.vaccinaties.data.vaccination_chart.left_divider_label,
              rightLabel:
                siteText.vaccinaties.data.vaccination_chart.right_divider_label,
            },
          ],
        }}
        initialWidth={400}
        minHeight={400}
        timeframe="all"
        values={data.values}
        displayTooltipValueOnly
        numGridLines={6}
        formatTickValue={(x) => formatNumber(x / 1000000)}
        formatTooltip={(x) => (
          <VaccineDeliveryAndAdministrationsTooltip
            data={x}
            estimateRange={data.estimatedRange}
          />
        )}
        seriesConfig={[
          {
            metricProperty: 'total_delivered',
            type: 'line',
            label: siteText.vaccinaties.data.vaccination_chart.legend.available,
            color: 'black',
            strokeWidth: 3,
          },
          ...vaccineNames.map<
            StackedAreaSeriesDefinition<VaccineDeliveryAndAdministrationsValue>
          >((x) => ({
            metricProperty: x as keyof VaccineDeliveryAndAdministrationsValue,
            type: 'stacked-area',
            label: replaceVariablesInText(
              siteText.vaccinaties.data.vaccination_chart.legend_label,
              {
                name: (productNames as Record<string, string>)[x],
              }
            ),
            shortLabel: (productNames as Record<string, string>)[x],
            color: (colors.data.vaccines as Record<string, string>)[x],
            fillOpacity: 1,
            strokeWidth: 0,
          })),
        ]}
      />
    </ChartTile>
  );
}
