import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { MetricKPI } from '~/components/metricKPI';
import { NationalHuisartsVerdenkingenValue } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export function SuspectedPatientsMetric(props: {
  data: NationalHuisartsVerdenkingenValue | undefined;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.verdenkingen_huisartsen.titel_kpi;
  const { utils } = siteText;
  const { dateOfReport } = siteText.common.metricKPI;

  if (data === undefined) return null;

  const description = replaceVariablesInText(dateOfReport, {
    dateOfReport: formatDateFromSeconds(utils, data.week_unix, 'medium'),
  });

  return (
    <MetricKPI
      title={title}
      value={Number(data.geschat_aantal)}
      format={formatNumber}
      description={description}
    />
  );
}
