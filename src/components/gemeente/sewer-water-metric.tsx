import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { SewerWaterBarScaleData } from '~/utils/sewer-water/municipality-sewer-water.util';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

export function SewerWaterMetric(props: { data: SewerWaterBarScaleData }) {
  const { data } = props;
  const { siteText }: ILocale = useContext(LocaleContext);
  const title = siteText.veiligheidsregio_rioolwater_metingen.titel_kpi;
  const { utils } = siteText;
  const { dateRangeOfReport } = siteText.common.metricKPI;

  const description =
    data.week_start_unix && data.week_end_unix
      ? replaceVariablesInText(dateRangeOfReport, {
          startDate: formatDateFromSeconds(utils, data.week_start_unix, 'axis'),
          endDate: formatDateFromSeconds(utils, data.week_end_unix, 'axis'),
        })
      : undefined;

  return (
    <MetricKPI
      title={title}
      value={data.value}
      format={formatNumber}
      description={description}
      valueAnnotation={siteText.waarde_annotaties.riool_normalized}
    />
  );
}
