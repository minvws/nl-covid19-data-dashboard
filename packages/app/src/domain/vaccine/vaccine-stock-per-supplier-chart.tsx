import { colors, getValuesInTimeframe, ArchivedNlVaccineStockValue, TimeframeOption } from '@corona-dashboard/common';
import { pick } from 'lodash';
import { useMemo, useState } from 'react';
import { isPresent } from 'ts-is-present';
import { Spacer } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { InteractiveLegend, SelectOption } from '~/components/interactive-legend';
import { SeriesConfig, TimeSeriesChart } from '~/components/time-series-chart';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { useCurrentDate } from '~/utils/current-date-context';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

interface VaccineStockPerSupplierChartProps {
  values: ArchivedNlVaccineStockValue[];
  text: SiteText['pages']['vaccinations_page']['nl'];
}

export function VaccineStockPerSupplierChart({ values, text }: VaccineStockPerSupplierChartProps) {
  const productNames = text.data.vaccination_chart.product_names;

  const today = useCurrentDate();
  const maximumValuesPerTimeframeOption = useMemo(
    () =>
      ({
        all: getMaximumPropertyValueInTimeframe(values, TimeframeOption.ALL, today),
      } as Record<TimeframeOption, number>),
    [values, today]
  );

  const optionsConfig: SelectOption[] = [
    {
      metricProperty: 'bio_n_tech_pfizer',
      color: colors.vaccines.bio_n_tech_pfizer,
      label: productNames.pfizer,
      shape: 'circle',
    },
    {
      metricProperty: 'moderna',
      color: colors.vaccines.moderna,
      label: productNames.moderna,
      shape: 'circle',
    },
    {
      metricProperty: 'astra_zeneca',
      color: colors.vaccines.astra_zeneca,
      label: productNames.astra_zeneca,
      shape: 'circle',
    },
    {
      metricProperty: 'janssen',
      color: colors.vaccines.janssen,
      label: productNames.janssen,
      shape: 'circle',
    },
  ];

  const allOptions = optionsConfig.map((x) => x.metricProperty);
  const [selected, setSelected] = useState<string>(allOptions[0]);

  const selectedConfig = optionsConfig.find((x) => x.metricProperty === selected) ?? optionsConfig[0];

  const seriesConfig: SeriesConfig<ArchivedNlVaccineStockValue> = [
    {
      type: 'area',
      metricProperty: `${selected}_available` as keyof ArchivedNlVaccineStockValue,
      label: replaceVariablesInText(text.stock_per_supplier_chart.legend.available, {
        vaccineName: selectedConfig.label,
      }),
      shortLabel: text.stock_per_supplier_chart.tooltip_labels.available,
      color: selectedConfig.color,
      curve: 'step',
    },
    {
      type: 'line',
      metricProperty: `${selected}_total` as keyof ArchivedNlVaccineStockValue,
      label: replaceVariablesInText(text.stock_per_supplier_chart.legend.total, {
        vaccineName: selectedConfig.label,
      }),
      shortLabel: text.stock_per_supplier_chart.tooltip_labels.total,
      color: colors.gray2,
      curve: 'step',
    },
  ];

  return (
    <ChartTile
      title={text.information_block.title}
      description={text.stock_per_supplier_chart.description}
      metadata={{
        source: text.bronnen.rivm,
      }}
    >
      <InteractiveLegend helpText={text.stock_per_supplier_chart.select_help_text} selectOptions={optionsConfig} selection={[selected]} onToggleItem={setSelected} />

      <Spacer marginBottom={space[2]} />

      <TimeSeriesChart
        accessibility={{
          key: 'vaccine_stock_per_supplier_chart',
        }}
        tooltipTitle={text.stock_per_supplier_chart.tooltip_title}
        values={values}
        seriesConfig={seriesConfig}
        timeframe={TimeframeOption.ALL}
        dataOptions={{
          forcedMaximumValue: maximumValuesPerTimeframeOption['all'],
        }}
      />
    </ChartTile>
  );
}

function getMaximumPropertyValueInTimeframe(values: ArchivedNlVaccineStockValue[], timeframe: TimeframeOption, today: Date) {
  const valuesInTimeframe = getValuesInTimeframe(values, timeframe, today);

  return valuesInTimeframe.reduce(
    (acc, value) => Math.max(acc, ...Object.values(pick(value, ['bio_n_tech_pfizer_total', 'moderna_total', 'astra_zeneca_total'])).filter(isPresent)),
    0
  );
}
