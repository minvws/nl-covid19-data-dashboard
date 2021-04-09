import { NlVaccineStockValue } from '@corona-dashboard/common';
import { useState } from 'react';
import { ChartTile } from '~/components-styled/chart-tile';
import {
  InteractiveLegend,
  SelectOption,
} from '~/components-styled/interactive-legend';
import {
  SeriesConfig,
  TimeSeriesChart,
} from '~/components-styled/time-series-chart';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
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

  const vaccineSelectOptions: SelectOption[] = [
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
  ];

  const selectableOptions = vaccineSelectOptions.map((x) => x.metricProperty);
  const [selected, setSelected] = useState<string>(selectableOptions[0]);
  const selectedVaccine =
    vaccineSelectOptions.find((x) => x.metricProperty === selected) ??
    vaccineSelectOptions[0];

  const seriesConfig: SeriesConfig<NlVaccineStockValue> = [
    {
      ...selectedVaccine,
      metricProperty: `${selected}_available` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(text.legend.available, {
        vaccineName: selectedVaccine.label,
      }),
      type: 'line',
    },
    {
      ...selectedVaccine,
      metricProperty: `${selected}_total` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(text.legend.total, {
        vaccineName: selectedVaccine.label,
      }),
      color: colors.lightGray,
      type: 'line',
    },
  ];

  return (
    <ChartTile
      title={text.title}
      description={text.description}
      metadata={{
        source: siteText.vaccinaties.bronnen.rivm,
      }}
    >
      <InteractiveLegend
        helpText={text.select_help_text}
        selectOptions={vaccineSelectOptions}
        selection={[selected]}
        onToggleItem={setSelected}
      />
      <TimeSeriesChart
        tooltipTitle={text.tooltip_title}
        values={values}
        seriesConfig={seriesConfig}
      />
    </ChartTile>
  );
}
