import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { MetricKPI } from '~/components/metricKPI';
import { NationalSewer } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export function SewerWaterMetric(props: { data: NationalSewer }) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.rioolwater_metingen.titel_kpi;
  const { utils } = siteText;
  const { dateRangeOfReport } = siteText.common.metricKPI;

  if (data === undefined) return null;

  const description = replaceVariablesInText(dateRangeOfReport, {
    startDate: formatDateFromSeconds(
      utils,
      data.last_value.week_start_unix,
      'axis'
    ),
    endDate: formatDateFromSeconds(
      utils,
      data.last_value.week_end_unix,
      'axis'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={data.last_value.average}
      format={formatNumber}
      description={description}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
