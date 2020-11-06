import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { NationalInfectedPeopleTotalValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

export function PositiveTestedPeopleMetric(props: {
  data: NationalInfectedPeopleTotalValue | undefined;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.positief_geteste_personen.titel_kpi;
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
      value={data.infected_daily_total}
      format={formatNumber}
      description={description}
    />
  );
}
