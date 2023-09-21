import { assert, colors, DateValue, ArchivedNlVaccineCoverage, ArchivedNlVaccineCoverageValue } from '@corona-dashboard/common';
import { first } from 'lodash';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { RadioGroup, RadioGroupItem } from '~/components/radio-group';
import { SeriesConfig, TimeSeriesChart, TimeSeriesChartProps } from '~/components/time-series-chart';
import { TooltipData } from '~/components/time-series-chart/components';
import { TimelineEventConfig } from '~/components/time-series-chart/components/timeline';
import { DataOptions, StackedAreaSeriesDefinition } from '~/components/time-series-chart/logic';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { VaccineDeliveryAndAdministrationsTooltip } from './components/vaccine-delivery-and-administrations-tooltip';
import { AdministrationData, VaccineAdministrationsValue } from './data-selection/select-administration-data';

export type ActiveVaccinationChart = 'coverage' | 'deliveryAndAdministration';

interface VaccinationsOverTimeChartProps {
  coverageData?: ArchivedNlVaccineCoverage;
  administrationData: AdministrationData;
  activeChart: ActiveVaccinationChart;
  timelineEvents: Partial<Record<ActiveVaccinationChart, TimelineEventConfig[]>>;
  text: SiteText['pages']['vaccinations_page']['nl'];
}

const vaccines = ['pfizer', 'moderna', 'astra_zeneca', 'janssen', 'novavax'] as const;
vaccines.forEach((x) => assert(colors.vaccines[x], `[${VaccinationsOverTimeChart.name}] missing vaccine color for vaccine ${x}`));

export function VaccinationsOverTimeChart(props: VaccinationsOverTimeChartProps) {
  const { coverageData, administrationData, activeChart, timelineEvents, text } = props;
  const { commonTexts, formatNumber } = useIntl();
  const breakpoints = useBreakpoints(true);

  const firstValue = first(administrationData.values);
  const vaccineNames = useMemo(() => vaccines.filter((x) => firstValue?.[x] !== undefined).reverse(), [firstValue]);

  const coverageChartConfiguration: TimeSeriesChartProps<DailyNlVaccineCoverageValue, SeriesConfig<DailyNlVaccineCoverageValue>> | undefined = useMemo(() => {
    return isDefined(coverageData)
      ? ({
          accessibility: { key: 'vaccine_coverage_over_time_chart' },
          values: transformToDayTimestamps(coverageData.values),
          minHeight: breakpoints.md ? 400 : 250,
          formatTickValue: (x: number) => `${x / 1_000_000}`,
          dataOptions: {
            valueAnnotation: text.grafiek_gevaccineerd_door_de_tijd_heen.waarde_annotatie,
            timelineEvents: timelineEvents.coverage,
          } as DataOptions,
          seriesConfig: [
            {
              label: text.grafiek_gevaccineerd_door_de_tijd_heen.label_gedeeltelijk,
              shortLabel: text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_gedeeltelijk,
              type: 'stacked-area',
              metricProperty: 'partially_vaccinated',
              color: colors.blue4,
              mixBlendMode: 'multiply',
              fillOpacity: 1,
            },
            {
              label: text.grafiek_gevaccineerd_door_de_tijd_heen.label_volledig,
              shortLabel: text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_volledig,
              type: 'stacked-area',
              metricProperty: 'fully_vaccinated',
              color: colors.primary,
              mixBlendMode: 'multiply',
              fillOpacity: 1,
            },
            {
              label: text.grafiek_gevaccineerd_door_de_tijd_heen.label_booster_vaccinated,
              shortLabel: text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_booster_vaccinated,
              type: 'stacked-area',
              metricProperty: 'booster_vaccinated',
              color: colors.blue10,
              mixBlendMode: 'multiply',
              fillOpacity: 1,
            },
            {
              label: text.grafiek_gevaccineerd_door_de_tijd_heen.label_totaal,
              shortLabel: text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_totaal,
              type: 'line',
              metricProperty: 'partially_or_fully_vaccinated',
              color: 'black',
            },
          ],
        } as TimeSeriesChartProps<DailyNlVaccineCoverageValue, SeriesConfig<DailyNlVaccineCoverageValue>>)
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
    text.grafiek_gevaccineerd_door_de_tijd_heen.label_booster_vaccinated,
    text.grafiek_gevaccineerd_door_de_tijd_heen.tooltip_label_booster_vaccinated,
    timelineEvents.coverage,
    breakpoints,
  ]);

  const deliveryAndAdministrationChartConfiguration = useMemo(() => {
    return {
      accessibility: {
        key: 'vaccine_delivery_and_administrations_area_chart',
      },
      dataOptions: {
        valueAnnotation: commonTexts.waarde_annotaties.x_miljoen,
        forcedMaximumValue: (seriesMax: number) => seriesMax * 1.1,
        timelineEvents: timelineEvents.deliveryAndAdministration,
      } as DataOptions,
      initialWidth: 400,
      minHeight: breakpoints.md ? 400 : 250,
      timeframe: 'all',
      values: administrationData.values,
      numGridLines: 6,
      formatTickValue: (x: number) => formatNumber(x / 1000000),
      formatTooltip: (x: TooltipData<VaccineAdministrationsValue>) => <VaccineDeliveryAndAdministrationsTooltip data={x} />,
      seriesConfig: [
        ...vaccineNames.map<StackedAreaSeriesDefinition<VaccineAdministrationsValue>>((x) => ({
          metricProperty: x as keyof VaccineAdministrationsValue,
          type: 'stacked-area',
          label: replaceVariablesInText(text.data.vaccination_chart.legend_label, {
            name: text.data.vaccination_chart.product_names[x],
          }),
          shortLabel: text.data.vaccination_chart.product_names[x],
          color: colors.vaccines[x],
          mixBlendMode: 'multiply',
          fillOpacity: 1,
          strokeWidth: 0,
        })),
        {
          metricProperty: 'total',
          type: 'invisible',
          label: text.data.vaccination_chart.doses_administered,
        },
      ],
    } as TimeSeriesChartProps<VaccineAdministrationsValue, SeriesConfig<VaccineAdministrationsValue>>;
  }, [
    administrationData,
    commonTexts.waarde_annotaties.x_miljoen,
    text.data.vaccination_chart.legend_label,
    text.data.vaccination_chart.doses_administered,
    breakpoints.md,
    text.data.vaccination_chart.product_names,
    vaccineNames,
    formatNumber,
    timelineEvents.deliveryAndAdministration,
  ]);

  const chartProps = activeChart === 'coverage' ? coverageChartConfiguration : deliveryAndAdministrationChartConfiguration;

  return isDefined(chartProps) ? <TimeSeriesChart {...(chartProps as any)} /> : null;
}

type DailyNlVaccineCoverageValue = Omit<ArchivedNlVaccineCoverageValue, 'date_start_unix' | 'date_end_unix'> & DateValue;

function transformToDayTimestamps(values: ArchivedNlVaccineCoverageValue[]) {
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
  const { commonTexts } = useIntl();

  const items: RadioGroupItem<ActiveVaccinationChart>[] = [
    {
      label: commonTexts.charts.vaccination_coverage_controls.coverage,
      value: 'coverage',
    },
    {
      label: commonTexts.charts.vaccination_coverage_controls.delivery_and_administration,
      value: 'deliveryAndAdministration',
    },
  ];

  return <RadioGroup value={initialChart} onChange={onChange} items={items} />;
}
