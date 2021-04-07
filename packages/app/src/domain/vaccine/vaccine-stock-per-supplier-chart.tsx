import { NlVaccineStockValue } from '@corona-dashboard/common';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { useIntl } from '~/intl';

interface VaccineStockPerSupplierChartProps {
  values: NlVaccineStockValue[];
}

export function VaccineStockPerSupplierChart({
  values,
}: VaccineStockPerSupplierChartProps) {
  const { siteText } = useIntl();
  const text = siteText.vaccinaties.stock_per_supplier_chart;

  return (
    <TimeSeriesChart
      tooltipTitle={text.tooltip_title}
      values={values}
      seriesConfig={
        [
          /* @TODO */
        ]
      }
    />
  );
}
