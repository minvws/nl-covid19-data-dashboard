import { NlVaccineAdministeredTotalValue } from '@corona-dashboard/common';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

export function VaccineAdministrationsOverTimeChart({
  title,
  values,
}: {
  title: string;
  values: NlVaccineAdministeredTotalValue[];
}) {
  const { sm } = useBreakpoints(true);

  return (
    <TimeSeriesChart
      initialWidth={400}
      height={sm ? 180 : 140}
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
