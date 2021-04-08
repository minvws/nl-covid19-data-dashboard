import { NlVaccineStockValue } from '@corona-dashboard/common';
import { useState } from 'react';
import { InteractiveLegend } from '~/components-styled/interactive-legend';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

interface VaccineStockPerSupplierChartProps {
  values: NlVaccineStockValue[];
}

export function VaccineStockPerSupplierChart({
  values,
}: VaccineStockPerSupplierChartProps) {
  const { siteText } = useIntl();
  const text = siteText.vaccinaties.stock_per_supplier_chart;

  const vaccines = ['bio_n_tech_pfizer', 'moderna', 'astra_zeneca'];
  const [selected, setSelected] = useState<string>(vaccines[0]);

  const legendConfig = vaccines.map((vaccine: string) => ({
    metricProperty: vaccine,
    color: 'red',
    label: vaccine,
  }));

  const chartConfig = [
    {
      metricProperty: `${selected}_available` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(
        'Beschikbare {{vaccineName}} vaccins in voorrraad',
        {
          vaccineName: selected,
        }
      ),
      type: 'line',
      color: 'blue',
    },
    {
      metricProperty: `${selected}_not_available` as keyof NlVaccineStockValue,
      label: replaceVariablesInText(
        'Totaal aantal {{vaccineName}} vaccins in voorraad',
        {
          vaccineName: selected,
        }
      ),
      type: 'line',
      color: 'gray',
    },
  ];

  return (
    <>
      <InteractiveLegend
        helpText={'Selecteer vaccintype om de voorraad te bekijken'}
        seriesConfig={legendConfig}
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
