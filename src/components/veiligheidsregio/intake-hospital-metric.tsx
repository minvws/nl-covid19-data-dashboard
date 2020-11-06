import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { ResultsPerRegion } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

export function IntakeHospitalMetric(props: {
  data: ResultsPerRegion | undefined;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.veiligheidsregio_ziekenhuisopnames_per_dag.titel_kpi;
  const { utils } = siteText;
  const { dateOfReport } = siteText.common.metricKPI;

  if (data === undefined) return null;

  const description = replaceVariablesInText(dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      utils,
      data?.last_value.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={data.last_value.hospital_moving_avg_per_region}
      format={formatNumber}
      description={description}
    />
  );
}
