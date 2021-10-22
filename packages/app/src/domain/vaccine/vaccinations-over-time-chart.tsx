import {
  colors,
  DateValue,
  NlVaccineCoverage,
  NlVaccineCoverageValue,
} from '@corona-dashboard/common';
import { first, last } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { RadioGroup, RadioGroupItem } from '~/components/radio-group';
import {
  SeriesConfig,
  TimeSeriesChart,
  TimeSeriesChartProps,
} from '~/components/time-series-chart';
import { TooltipData } from '~/components/time-series-chart/components';
import {
  DataOptions,
  StackedAreaSeriesDefinition,
} from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';
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

export type ActiveVaccinationChart = 'coverage' | 'deliveryAndAdministration';

interface VaccinationsOverTimeChartProps {
  coverageData?: NlVaccineCoverage;
  deliveryAndAdministrationData: DeliveryAndAdministrationData;
  activeChart: ActiveVaccinationChart;
}

export function VaccinationsOverTimeChart(
  props: VaccinationsOverTimeChartProps
) {
  const { coverageData, deliveryAndAdministrationData, activeChart } = props;
  const { siteText, formatNumber } = useIntl();
  const text = siteText.vaccinaties;
  const breakpoints = useBreakpoints(true);

  const firstValue = first(deliveryAndAdministrationData.values);
  const vaccineNames = useMemo(
    () => vaccines.filter((x) => firstValue?.[x] !== undefined).reverse(),
    [firstValue]
  );

  const coverageChartConfiguration:
    | TimeSeriesChartProps<
        DailyNlVaccineCoverageValue,
        SeriesConfig<DailyNlVaccineCoverageValue>
      >
    | undefined = useMemo(() => {
    return isDefined(coverageData)
      ? ({
          accessibility: { key: 'vaccine_coverage_over_time_chart' },
          values: transformToDayTimestamps(coverageData.values),
          formatTickValue: (x: number) => `${x / 1_000_000}`,
          dataOptions: {
            valueAnnotation:
              text.grafiek_gevaccineerd_door_de_tijd_heen.waarde_annotatie,
            timespanAnnotations: [
              {
                fill: 'none',
                start: first(coverageData.values)?.date_start_unix ?? 0,
                end: last(coverageData.values)?.date_end_unix ?? 0,
                label:
                  siteText.vaccinaties.vaccinations_over_time_tile
                    .tooltip_header,
              },
            ],
          } as DataOptions,
          seriesConfig: [
            {
              label: text.grafiek_gevaccineerd_door_de_tijd_heen.label_totaal,
              shortLabel:
                text.grafiek_gevaccineerd_door_de_tijd_heen
                  .tooltip_label_totaal,
              type: 'line',
              metricProperty: 'partially_or_fully_vaccinated',
              color: 'black',
            },
            {
              label:
                text.grafiek_gevaccineerd_door_de_tijd_heen.label_gedeeltelijk,
              shortLabel:
                text.grafiek_gevaccineerd_door_de_tijd_heen
                  .tooltip_label_gedeeltelijk,
              type: 'stacked-area',
              metricProperty: 'partially_vaccinated',
              color: colors.data.partial_vaccination,
              mixBlendMode: 'multiply',
              fillOpacity: 1,
            },
            {
              label: text.grafiek_gevaccineerd_door_de_tijd_heen.label_volledig,
              shortLabel:
                text.grafiek_gevaccineerd_door_de_tijd_heen
                  .tooltip_label_volledig,
              type: 'stacked-area',
              metricProperty: 'fully_vaccinated',
              color: colors.data.primary,
              mixBlendMode: 'multiply',
              fillOpacity: 1,
            },
          ],
        } as TimeSeriesChartProps<
          DailyNlVaccineCoverageValue,
          SeriesConfig<DailyNlVaccineCoverageValue>
        >)
      : undefined;
  }, [
    coverageData,
    text.grafiek_gevaccineerd_door_de_tijd_heen.waarde_annotatie,
    text.grafiek_gevaccineerd_door_de_tijd_heen.label_totaal,
    text.grafiek_gevaccineerd_door_de_tijd_heen.label_gedeeltelijk,
    text.grafiek_gevaccineerd_door_de_tijd_heen.label_volledig,
    text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_totaal,
    text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_gedeeltelijk,
    text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_volledig,
  ]);

  const deliveryAndAdministrationChartConfiguration = useMemo(() => {
    return {
      accessibility: {
        key: 'vaccine_delivery_and_administrations_area_chart',
      },
      dataOptions: {
        valueAnnotation: siteText.waarde_annotaties.x_miljoen,
        forcedMaximumValue: (seriesMax: number) => seriesMax * 1.1,
        timespanAnnotations: [
          {
            fill: 'none',
            start: first(deliveryAndAdministrationData.values)?.date_unix ?? 0,
            end: last(deliveryAndAdministrationData.values)?.date_unix ?? 0,
            label:
              siteText.vaccinaties.vaccinations_over_time_tile.tooltip_header,
          },
        ],
      } as DataOptions,
      initialWidth: 400,
      minHeight: breakpoints.md ? 400 : 250,
      timeframe: 'all',
      values: deliveryAndAdministrationData.values,
      numGridLines: 6,
      formatTickValue: (x: number) => formatNumber(x / 1000000),
      formatTooltip: (
        x: TooltipData<VaccineDeliveryAndAdministrationsValue>
      ) => <VaccineDeliveryAndAdministrationsTooltip data={x} />,
      seriesConfig: [
        {
          metricProperty: 'total_delivered',
          type: 'line',
          label: text.data.vaccination_chart.legend.available,
          color: 'black',
          strokeWidth: 3,
        },
        ...vaccineNames.map<
          StackedAreaSeriesDefinition<VaccineDeliveryAndAdministrationsValue>
        >((x) => ({
          metricProperty: x as keyof VaccineDeliveryAndAdministrationsValue,
          type: 'stacked-area',
          label: replaceVariablesInText(
            text.data.vaccination_chart.legend_label,
            {
              name: text.data.vaccination_chart.product_names[x],
            }
          ),
          shortLabel: text.data.vaccination_chart.product_names[x],
          color: colors.data.vaccines[x],
          mixBlendMode: 'multiply',
          fillOpacity: 1,
          strokeWidth: 0,
        })),
        {
          metricProperty: 'total',
          type: 'invisible',
          label: text.data.vaccination_chart.doses_administered_total,
        },
      ],
    } as TimeSeriesChartProps<
      VaccineDeliveryAndAdministrationsValue,
      SeriesConfig<VaccineDeliveryAndAdministrationsValue>
    >;
  }, [
    deliveryAndAdministrationData,
    siteText.waarde_annotaties.x_miljoen,
    text.data.vaccination_chart.legend.available,
    text.data.vaccination_chart.legend_label,
    text.data.vaccination_chart.doses_administered_total,
    breakpoints.md,
    text.data.vaccination_chart.product_names,
    vaccineNames,
    formatNumber,
  ]);

  const chartProps =
    activeChart === 'coverage'
      ? coverageChartConfiguration
      : deliveryAndAdministrationChartConfiguration;

  return isDefined(chartProps) ? (
    <TimeSeriesChart {...(chartProps as any)} />
  ) : null;
}

type DailyNlVaccineCoverageValue = Omit<
  NlVaccineCoverageValue,
  'date_start_unix' | 'date_end_unix'
> &
  DateValue;

function transformToDayTimestamps(values: NlVaccineCoverageValue[]) {
  return values.map<DailyNlVaccineCoverageValue>((x) => {
    const newValue = {
      ...x,
      date_unix: x.date_end_unix,
    } as DailyNlVaccineCoverageValue;
    delete (newValue as any).date_start_unix;
    delete (newValue as any).date_end_unix;
    return newValue;
  });
}

interface VaccinationChartControlsProps {
  initialChart: ActiveVaccinationChart;
  onChange: (value: ActiveVaccinationChart) => void;
}

export function VaccinationChartControls(props: VaccinationChartControlsProps) {
  const { onChange, initialChart } = props;
  const { siteText } = useIntl();

  const items: RadioGroupItem<ActiveVaccinationChart>[] = [
    {
      label: siteText.charts.vaccination_coverage_controls.coverage,
      value: 'coverage',
    },
    {
      label:
        siteText.charts.vaccination_coverage_controls
          .delivery_and_administration,
      value: 'deliveryAndAdministration',
    },
  ];

  return <RadioGroup value={initialChart} onChange={onChange} items={items} />;
}
