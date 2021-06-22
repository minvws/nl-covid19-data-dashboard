import { NlVaccineAdministeredTotalValue } from '@corona-dashboard/common';
import { AccessibilityOptions } from '~/utils/use-accessibility-options';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

export function VaccineAdministrationsOverTimeChart({
  title,
  values,
  accessibility,
}: {
  title: string;
  values: NlVaccineAdministeredTotalValue[];
  accessibility: AccessibilityOptions;
}) {
  const { sm } = useBreakpoints(true);

  return (
    <TimeSeriesChart
      accessibility={accessibility}
      initialWidth={400}
      minHeight={sm ? 180 : 140}
      timeframe="all"
      values={values}
      displayTooltipValueOnly
      numGridLines={2}
      seriesConfig={[
        {
          metricProperty: 'estimated',
          type: 'area',
          label: title,
          color: colors.data.primary,
        },
      ]}
    />
  );
}
