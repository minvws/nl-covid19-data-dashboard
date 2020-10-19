import { RioolwaterMetingen } from '~/types/data.d';
import { MetricKPI } from '~/components/metricKPI';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';

import siteText from '~/locale/index';

const text = siteText.common.metricKPI;
const title = siteText.rioolwater_metingen.titel;

export function SewerWaterMetric(props: {
  data: RioolwaterMetingen | undefined;
}) {
  const { data } = props;

  const description = data?.last_value.date_of_insertion_unix
    ? replaceVariablesInText(text.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          data?.last_value.date_of_insertion_unix,
          'relative'
        ),
      })
    : undefined;

  if (!data) return null;

  return (
    <MetricKPI
      title={title}
      value={Number(data.last_value.average)}
      format={formatNumber}
      description={description}
    />
  );
}
