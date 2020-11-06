import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { NationalNursingHomeValue } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

export function NursingHomeInfectedLocationsMetric(props: {
  data: NationalNursingHomeValue;
}) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.verpleeghuis_besmette_locaties.titel_kpi;
  const { utils } = siteText;
  const { dateOfReport } = siteText.common.metricKPI;

  if (!data) return null;

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
      value={data.infected_locations_total}
      format={formatNumber}
      description={description}
    />
  );
}
