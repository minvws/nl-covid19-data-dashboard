import { assert } from '~/utils/assert';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { SidebarBarScale } from './sidebar-barscale';
import { SidebarKpiValue } from './sidebar-kpi-value';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import siteText from '~/locale/index';
import { getDataConfig, DataScope } from './data-config';

interface SidebarMetricProps<T> {
  scope: DataScope;
  data: T;
  metricName: string;
  metricProperty: string;
  localeTextKey: string;
  differenceKey?: string;
  showBarScale?: boolean;
  isWeeklyData?: boolean;
  annotationKey?: string;
}

export function SidebarMetric<T>({
  scope,
  data,
  metricName,
  metricProperty,
  localeTextKey,
  differenceKey,
  showBarScale,
  annotationKey,
}: SidebarMetricProps<T>) {
  const lastValue = get(data, [metricName, 'last_value']);
  const propertyValue = lastValue && lastValue[metricProperty];

  assert(
    isDefined(propertyValue),
    `Missing value for metric property ${[
      metricName,
      'last_value',
      metricProperty,
    ]
      .filter(isDefined)
      .join(':')}`
  );

  const config = getDataConfig(scope, metricName, metricProperty);
  const commonText = siteText.common.metricKPI;

  const title = get(siteText, [localeTextKey, 'titel_kpi']);
  assert(title, `Missing title at %{localeTextKey}.titel_kpi`);

  const description = config.isWeeklyData
    ? replaceVariablesInText(commonText.dateRangeOfReport, {
        startDate: formatDateFromSeconds(lastValue.week_start_unix, 'axis'),
        endDate: formatDateFromSeconds(lastValue.week_end_unix, 'axis'),
      })
    : replaceVariablesInText(commonText.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          lastValue.date_of_report_unix,
          'medium'
        ),
      });

  const differenceValue = differenceKey
    ? get(data, ['difference', differenceKey])
    : undefined;

  if (differenceKey) {
    /**
     * If you pass in a difference key, it should exist
     */
    assert(
      isDefined(differenceValue),
      `Missing value for difference:${differenceKey}`
    );
  }

  const valueAnnotation = annotationKey
    ? get(siteText, ['waarde_annotaties', annotationKey])
    : undefined;

  if (annotationKey) {
    /**
     * If you pass in an annotation key, it should exist
     */
    assert(
      valueAnnotation,
      `Missing value annotation at waarde_annotaties:${annotationKey}`
    );
  }

  return (
    <Box spacing={1} mx={'2.5rem'}>
      <SidebarKpiValue
        title={title}
        value={propertyValue}
        isPercentage={config.isPercentage}
        description={description}
        difference={differenceValue}
      />
      {showBarScale && (
        <SidebarBarScale
          localeTextKey={localeTextKey}
          value={propertyValue}
          config={config.barScale}
          uniqueId={[scope, metricName, metricProperty].join(':')}
        />
      )}
    </Box>
  );
}
