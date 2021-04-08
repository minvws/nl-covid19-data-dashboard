import { NlVaccineStockValue } from '@corona-dashboard/common';
import { useState } from 'react';
import { InteractiveLegend } from '~/components-styled/interactive-legend';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { colors } from '~/style/theme';

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

  const vaccineSelectOptions = [
    {
      metricProperty: 'bio_n_tech_pfizer' as const,
      color: colors.data.vaccines.bio_n_tech_pfizer,
      label: productNames.pfizer,
      shape: 'circle' as const,
      type: 'line' as const,
    },
    {
      metricProperty: 'moderna' as const,
      color: colors.data.vaccines.moderna,
      label: productNames.moderna,
      shape: 'circle' as const,
      type: 'line' as const,
    },
    {
      metricProperty: 'astra_zeneca' as const,
      color: colors.data.vaccines.astra_zeneca,
      label: productNames.astra_zeneca,
      shape: 'circle' as const,
      type: 'line' as const,
    },
  ];

  const selectableOptions = vaccineSelectOptions.map((x) => x.metricProperty);
  const [selected, setSelected] = useState<string>(selectableOptions[0]);
  const selectedVaccine =
    vaccineSelectOptions.find((x) => x.metricProperty === selected) ??
    vaccineSelectOptions[0];

  const chartConfig = [
    {
      ...selectedVaccine,
      metricProperty: `${selected}_available` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(text.legend.available, {
        vaccineName: selectedVaccine.label,
      }),
    },
    {
      ...selectedVaccine,
      metricProperty: `${selected}_total` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(text.legend.total, {
        vaccineName: selectedVaccine.label,
      }),
      color: colors.lightGray,
    },
  ];

  return (
    <>
      <InteractiveLegend
        helpText={text.select_help_text}
        selectOptions={vaccineSelectOptions}
        selection={[selected]}
        onToggleItem={setSelected}
      />
      <TimeSeriesChart
        tooltipTitle={text.tooltip_title}
        values={values}
        seriesConfig={chartConfig}
      />
    </>
  );
}
