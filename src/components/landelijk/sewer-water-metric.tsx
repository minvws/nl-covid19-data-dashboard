import { MetricKPI } from '~/components/metricKPI';
import siteText from '~/locale/index';
import { RioolwaterMetingen } from '~/types/data.d';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;
const title = siteText.rioolwater_metingen.titel;

export function SewerWaterMetric(props: {
  data: RioolwaterMetingen | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  const description = replaceVariablesInText(text.dateOfReport, {
    dateOfReport: formatDateFromSeconds(
      data?.last_value.date_of_insertion_unix,
      'relative'
    ),
  });

  return (
    <MetricKPI
      title={title}
      value={Number(data.last_value.average)}
      format={formatNumber}
      description={description}
    />
  );
}
