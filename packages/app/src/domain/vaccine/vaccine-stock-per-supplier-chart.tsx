import {
  getValuesInTimeframe,
  NlVaccineStockValue,
  TimeframeOption,
} from '@corona-dashboard/common';
import { pick } from 'lodash';
import { useMemo, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import {
  InteractiveLegend,
  SelectOption,
} from '~/components/interactive-legend';
import { SeriesConfig, TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface VaccineStockPerSupplierChartProps {
  values: NlVaccineStockValue[];
}

export function VaccineStockPerSupplierChart({
  values,
}: VaccineStockPerSupplierChartProps) {
  const { siteText } = useIntl();
  const text = siteText.vaccinaties.stock_per_supplier_chart;

  const productNames =
    siteText.vaccinaties.data.vaccination_chart.product_names;

  const today = useCurrentDate();
  const maximumValuesPerTimeframeOption = useMemo(
    () =>
      ({
        all: getMaximumPropertyValueInTimeframe(values, 'all', today),
        '5weeks': getMaximumPropertyValueInTimeframe(values, '5weeks', today),
      } as Record<TimeframeOption, number>),
    [values, today]
  );

  const optionsConfig: SelectOption[] = [
    {
      metricProperty: 'bio_n_tech_pfizer',
      color: colors.data.vaccines.bio_n_tech_pfizer,
      label: productNames.pfizer,
      shape: 'circle',
    },
    {
      metricProperty: 'moderna',
      color: colors.data.vaccines.moderna,
      label: productNames.moderna,
      shape: 'circle',
    },
    {
      metricProperty: 'astra_zeneca',
      color: colors.data.vaccines.astra_zeneca,
      label: productNames.astra_zeneca,
      shape: 'circle',
    },
    {
      metricProperty: 'janssen',
      color: colors.data.vaccines.janssen,
      label: productNames.janssen,
      shape: 'circle',
    },
  ];

  const allOptions = optionsConfig.map((x) => x.metricProperty);
  const [selected, setSelected] = useState<string>(allOptions[0]);

  const selectedConfig =
    optionsConfig.find((x) => x.metricProperty === selected) ??
    optionsConfig[0];

  const seriesConfig: SeriesConfig<NlVaccineStockValue> = [
    {
      type: 'area',
      metricProperty: `${selected}_available` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(text.legend.available, {
        vaccineName: selectedConfig.label,
      }),
      shortLabel: text.tooltip_labels.available,
      color: selectedConfig.color,
      curve: 'step',
    },
    {
      type: 'line',
      metricProperty: `${selected}_total` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(text.legend.total, {
        vaccineName: selectedConfig.label,
      }),
      shortLabel: text.tooltip_labels.total,
      color: colors.lightGray,
      curve: 'step',
    },
  ];

  return (
    <ChartTile
      title={text.title}
      description={text.description}
      metadata={{
        source: siteText.vaccinaties.bronnen.rivm,
      }}
      timeframeOptions={['all', '5weeks']}
      timeframeInitialValue="5weeks"
    >
      {(timeframe) => (
        <>
          <InteractiveLegend
            helpText={text.select_help_text}
            selectOptions={optionsConfig}
            selection={[selected]}
            onToggleItem={setSelected}
          />
          <Spacer mb={2} />
          <TimeSeriesChart
            accessibility={{
              key: 'vaccine_stock_per_supplier_chart',
            }}
            tooltipTitle={text.tooltip_title}
            values={values}
            seriesConfig={seriesConfig}
            timeframe={timeframe}
            dataOptions={{
              forcedMaximumValue: maximumValuesPerTimeframeOption[timeframe],
            }}
          />
        </>
      )}
    </ChartTile>
  );
}

function getMaximumPropertyValueInTimeframe(
  values: NlVaccineStockValue[],
  timeframe: TimeframeOption,
  today: Date
) {
  const valuesInTimeframe = getValuesInTimeframe(values, timeframe, today);

  return valuesInTimeframe.reduce(
    (acc, value) =>
      Math.max(
        acc,
        ...Object.values(
          pick(value, [
            'bio_n_tech_pfizer_total',
            'moderna_total',
            'astra_zeneca_total',
          ])
        ).filter(isPresent)
      ),
    0
  );
}
