import last from 'lodash/last';
import { ChartTile } from '~/components/chart-tile';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { StackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import {
  DeliveryAndAdministrationData,
  VaccineAdministeredAndDeliveredValue,
} from './data-selection/selected-delivery-and-administration-data';
import { useVaccineNames } from './use-vaccine-names';

export function VaccineDeliveryAndAdministrationsAreaChart2({
  data,
}: {
  data: DeliveryAndAdministrationData;
}) {
  const { siteText } = useIntl();
  const lastValue = last(data.values);
  const vaccineNames = useVaccineNames(lastValue).reverse();

  const productNames =
    siteText.vaccinaties.data.vaccination_chart.product_names;

  return (
    <ChartTile
      title={'titel'}
      description={'omschrijving'}
      metadata={{
        date: lastValue?.date_of_report_unix,
        source: siteText.vaccinaties.bronnen.rivm,
      }}
    >
      <TimeSeriesChart
        dataOptions={{
          valueAnnotation: 'x miljoen',
          timespanAnnotations: [
            {
              type: 'estimate',
              start: data.estimatedRange[0],
              end: data.estimatedRange[1],
              label: 'Verwacht',
            },
          ],
        }}
        initialWidth={400}
        minHeight={400}
        timeframe="all"
        values={data.values}
        displayTooltipValueOnly
        numGridLines={6}
        formatTickValue={(x) => (x / 1000000).toString()}
        seriesConfig={[
          {
            metricProperty: 'total_delivered',
            type: 'line',
            label: 'Geleverde en beschikbare vaccins',
            color: 'black',
            strokeWidth: 3,
          },
          ...vaccineNames.map<
            StackedAreaSeriesDefinition<VaccineAdministeredAndDeliveredValue>
          >((x) => ({
            metricProperty: x as keyof VaccineAdministeredAndDeliveredValue,
            type: 'stacked-area',
            label: `Aantal gezette prikken ${(productNames as any)[x]}`,
            color: (colors.data.vaccines as any)[x],
            fillOpacity: 1,
            strokeWidth: 0,
          })),
        ]}
      />
    </ChartTile>
  );
}
