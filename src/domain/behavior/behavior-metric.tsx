import css from '@styled-system/css';
import siteText from '~/locale/index';
import { NationalBehavior, RegionalBehavior } from '~/types/data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.common.metricKPI;

const title = siteText.gedrag_common.kpi_titel;

interface BehaviorMetricProps {
  data: NationalBehavior | RegionalBehavior;
}

export function BehaviorMetric({ data }: BehaviorMetricProps) {
  if (!data?.last_value) {
    return null;
  }

  const description = replaceVariablesInText(text.dateRangeOfReport, {
    startDate: formatDateFromSeconds(data.last_value.week_start_unix, 'axis'),
    endDate: formatDateFromSeconds(data.last_value.week_end_unix, 'axis'),
  });

  return (
    <>
      <h4
        css={css({
          fontSize: 2,
          fontWeight: 'normal',
          mb: 2,
          mt: 0,
        })}
      >
        {title}
      </h4>
      <p
        css={css({
          m: 0,
          color: 'gray',
          fontSize: 1,
        })}
      >
        {description}
      </p>
    </>
  );
}
