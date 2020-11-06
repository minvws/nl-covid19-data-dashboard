import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { RegionaalValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

export function PositivelyTestedPeopleMetric(props: {
  data: RegionaalValue | undefined;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.gemeente_positief_geteste_personen.titel_kpi;
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
      value={data.total_reported_increase_per_region}
      format={formatNumber}
      description={description}
    />
  );
}
