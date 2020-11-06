import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { MetricKPI } from '~/components/metricKPI';
import { InfectiousPeopleLastKnownAverageValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export function InfectiousPeopleMetric(props: {
  data: InfectiousPeopleLastKnownAverageValue | undefined;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.besmettelijke_personen.titel_kpi;
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
      value={data.infectious_avg}
      format={formatNumber}
      description={description}
    />
  );
}
