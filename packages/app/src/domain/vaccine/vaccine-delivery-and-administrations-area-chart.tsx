import { assert, colors } from '@corona-dashboard/common';
import { first } from 'lodash';
import { useMemo } from 'react';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { StackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { VaccineDeliveryAndAdministrationsTooltip } from './components/vaccine-delivery-and-administrations-tooltip';
import {
  DeliveryAndAdministrationData,
  VaccineDeliveryAndAdministrationsValue,
} from './data-selection/select-delivery-and-administration-data';

const vaccines = ['pfizer', 'moderna', 'astra_zeneca', 'janssen'] as const;

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
    () => vaccines.filter((x) => firstValue?.[x] !== undefined).reverse(),
    [firstValue]
  );

  const breakpoints = useBreakpoints(true);

  const productNames =
    siteText.vaccinaties.data.vaccination_chart.product_names;

  return (
    <ChartTile
      title={siteText.vaccinaties.grafiek.titel}
      description={siteText.vaccinaties.grafiek.omschrijving}
      metadata={{
        source: siteText.vaccinaties.bronnen.rivm,
      }}
    >
      <TimeSeriesChart
        accessibility={{
          key: 'vaccine_delivery_and_administrations_area_chart',
        }}
        dataOptions={{
          valueAnnotation: siteText.waarde_annotaties.x_miljoen,
          forcedMaximumValue: (seriesMax) => seriesMax * 1.1,
        }}
        initialWidth={400}
        minHeight={breakpoints.md ? 400 : 250}
        timeframe="all"
        values={data.values}
        numGridLines={6}
        formatTickValue={(x) => formatNumber(x / 1000000)}
        formatTooltip={(x) => (
          <VaccineDeliveryAndAdministrationsTooltip data={x} />
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
                name: productNames[x],
              }
            ),
            shortLabel: productNames[x],
            color: colors.data.vaccines[x],
            mixBlendMode: 'multiply',
            fillOpacity: 1,
            strokeWidth: 0,
          })),
          {
            metricProperty: 'total',
            type: 'invisible',
            label:
              siteText.vaccinaties.data.vaccination_chart
                .doses_administered_total,
          },
        ]}
      />
    </ChartTile>
  );
}
