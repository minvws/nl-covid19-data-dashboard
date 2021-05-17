import { first } from 'lodash';
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
} from './data-selection/selected-delivery-and-administration-data';
import { useVaccineNames } from './use-vaccine-names';

export function VaccineDeliveryAndAdministrationsAreaChart({
  data,
}: {
  data: DeliveryAndAdministrationData;
}) {
  const { siteText, formatNumber } = useIntl();
  const firstValue = first(data.values);
  const vaccineNames = useVaccineNames(firstValue).reverse();

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
              type: 'estimate',
              start: data.estimatedRange[0],
              end: data.estimatedRange[1],
              label:
                siteText.vaccinaties.data.vaccination_chart.legend.expected,
              shapeComponent: <HatchedSquare />,
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
                name: (productNames as any)[x],
              }
            ),
            color: (colors.data.vaccines as any)[x],
            fillOpacity: 1,
            strokeWidth: 0,
          })),
        ]}
      />
    </ChartTile>
  );
}

function HatchedSquare() {
  return (
    <svg height="15" width="15">
      <defs>
        <pattern
          id="hatch"
          width="4"
          height="4"
          patternTransform="rotate(-45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="5"
            style={{ stroke: 'grey', strokeWidth: 3 }}
          />
        </pattern>
      </defs>
      <rect height="15" width="15" fill="white" />
      <rect height="15" width="15" fill="url(#hatch)" />
    </svg>
  );
}
