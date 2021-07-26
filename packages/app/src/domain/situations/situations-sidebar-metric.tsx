import { SidebarKpiValue } from '~/components/sidebar-metric/sidebar-kpi-value';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

type SituationsSidebarMetricProps = {
  date_start_unix: number;
  date_end_unix: number;
};

export function SituationsSidebarMetric({
  date_start_unix,
  date_end_unix,
}: SituationsSidebarMetricProps) {
  const { siteText, formatDateFromSeconds } = useIntl();
  const commonText = siteText.common.metricKPI;
  const dateText = replaceVariablesInText(commonText.dateRangeOfReport, {
    startDate: formatDateFromSeconds(date_start_unix, 'axis'),
    endDate: formatDateFromSeconds(date_end_unix, 'axis'),
  });

  return (
    <SidebarKpiValue
      title={siteText.brononderzoek.kpi_titel}
      description={dateText}
    />
  );
}
