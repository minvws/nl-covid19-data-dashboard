import {
  National,
  NlVaccineAdministeredEstimateValue,
  NlVaccineAdministeredValue,
  NlVaccineDeliveryEstimateValue,
  NlVaccineDeliveryValue,
} from '@corona-dashboard/common';
import { AreaChart } from '~/components/area-chart';
import { ChartTile } from '~/components/chart-tile';
import { Legend } from '~/components/legend';
import { useVaccineDeliveryData } from '~/domain/vaccine/use-vaccine-delivery-data';
import { useVaccineNames } from '~/domain/vaccine/use-vaccine-names';
import { FormatVaccinationsTooltip } from '~/domain/vaccine/vaccine-delivery-tooltip';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function VaccineDeliveryAndAdministrationsAreaChart({
  data,
}: {
  data: Pick<
    National,
    | 'vaccine_administered'
    | 'vaccine_delivery'
    | 'vaccine_delivery_estimate'
    | 'vaccine_administered_estimate'
  >;
}) {
  const { siteText } = useIntl();

  const text = siteText.vaccinaties;

  const vaccineNames = useVaccineNames(data.vaccine_administered.last_value);

  const [
    vaccineDeliveryValues,
    vaccineDeliveryEstimateValues,
    vaccineAdministeredValues,
    vaccineAdministeredEstimateValues,
  ] = useVaccineDeliveryData(data);

  return (
    <ChartTile
      title={text.grafiek.titel}
      description={text.grafiek.omschrijving}
      metadata={{
        date: data.vaccine_delivery.last_value.date_of_report_unix,
        source: text.bronnen.rivm,
      }}
    >
      <AreaChart<
        NlVaccineDeliveryValue | NlVaccineDeliveryEstimateValue,
        NlVaccineAdministeredValue | NlVaccineAdministeredEstimateValue
      >
        valueAnnotation={siteText.waarde_annotaties.x_miljoen}
        timeframe="all"
        formatTooltip={(values) => FormatVaccinationsTooltip(values, siteText)}
        divider={{
          color: colors.annotation,
          leftLabel: text.data.vaccination_chart.left_divider_label,
          rightLabel: text.data.vaccination_chart.right_divider_label,
        }}
        trends={[
          {
            values: vaccineDeliveryValues,
            displays: [
              {
                metricProperty: 'total',
                strokeWidth: 3,
                color: 'black',
                legendLabel: text.data.vaccination_chart.delivered,
              },
            ],
          },
          {
            values: vaccineDeliveryEstimateValues,
            displays: [
              {
                metricProperty: 'total',
                style: 'dashed',
                strokeWidth: 3,
                legendLabel: text.data.vaccination_chart.estimated,
                color: 'black',
              },
            ],
          },
        ]}
        areas={[
          {
            values: vaccineAdministeredValues,
            displays: vaccineNames.map((key) => ({
              metricProperty: key as any,
              color: (colors.data.vaccines as any)[key],
              legendLabel: key,
            })),
          },
          {
            values: vaccineAdministeredEstimateValues,
            displays: vaccineNames.map((key) => ({
              metricProperty: key as any,
              pattern: 'hatched',
              color: (colors.data.vaccines as any)[key],
              legendLabel: key,
            })),
          },
        ]}
      />

      <Legend
        items={[
          {
            label: text.data.vaccination_chart.legend.available,
            color: 'black',
            shape: 'line',
          },
          {
            label: text.data.vaccination_chart.legend.expected,
            shape: 'custom',
            shapeComponent: <HatchedSquare />,
          },
        ]}
      />
      <Legend
        items={vaccineNames.map((key) => ({
          label: replaceVariablesInText(
            text.data.vaccination_chart.legend_label,
            {
              name: (text.data.vaccination_chart.product_names as any)[key],
            }
          ),
          color: `data.vaccines.${key}`,
          shape: 'square',
        }))}
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
