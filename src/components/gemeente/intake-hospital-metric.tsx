import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { MetricKPI } from '~/components/metricKPI';
import { HospitalAdmissionsLastValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export function IntakeHospitalMetric(props: {
  data: HospitalAdmissionsLastValue | undefined;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.gemeente_ziekenhuisopnames_per_dag.barscale_titel;
  const { utils } = siteText;
  const { dateOfReport } = siteText.common.metricKPI;

  if (data === undefined) return null;

  const description = replaceVariablesInText(dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      utils,
      data.date_of_report_unix,
      'medium'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={data.moving_average_hospital}
      format={formatNumber}
      description={description}
    />
  );
}
