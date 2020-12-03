import { assert } from '~/utils/assert';
import { get } from 'lodash';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components-styled/base';
import { SidebarBarScale } from './sidebar-barscale';
import { SidebarKpiValue } from './sidebar-kpi-value';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { formatDateFromSeconds } from '~/utils/formatDate';
import siteText from '~/locale/index';
import {getDataConfig} from './data-config'

interface SidebarMetricProps<T> {
  data: T;
  metricName: string;
  metricProperty: string;
  localeTextKey: string;
  differenceProperty?: string;
  showBarScale?: boolean;
  isRangeData?: boolean;
  annotationKey?: string;
}

export function SidebarMetric<T>({
  data,
  metricName,
  metricProperty,
  localeTextKey,
  differenceProperty,
  showBarScale,
  annotationKey,
}: SidebarMetricProps<T>) {
  const value = get(data, [metricName, 'last_value', metricProperty]);
  const config = getDataConfig(metricName, metricProperty);
  const commonText = siteText.common.metricKPI;

  const title = get(siteText, [localeTextKey, 'titel_kpi']);
  assert(title, `Missing title at %{localeTextKey}.titel_kpi`);

  const description = config.isRangeData
    ? replaceVariablesInText(commonText.dateRangeOfReport, {
        startDate: formatDateFromSeconds(value.week_start_unix, 'axis'),
        endDate: formatDateFromSeconds(value.week_end_unix, 'axis'),
      })
    : replaceVariablesInText(commonText.dateOfReport, {
        dateOfReport: formatDateFromSeconds(
          value.date_of_report_unix,
          'medium'
        ),
      });

  assert(
    value,
    `Missing value for metric property ${[
      metricName,
      'last_value',
      metricProperty,
    ]
      .filter(isDefined)
      .join(':')}`
  );

  const differenceValue = differenceProperty
    ? get(data, ['difference', differenceProperty])
    : undefined;

  if (differenceProperty) {
    /**
     * If you pass in a difference property, it should exist
     */
    assert(
      differenceValue,
      `Missing value for difference:${differenceProperty}`
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
    <Box spacing={2}>
      <SidebarKpiValue
        title={title}
        value={value}
        isPercentage={
        description={description}
        difference={differenceValue}
      />
      {showBarScale && (
        <SidebarBarScale
          localeTextKey={localeTextKey}
          value={value}
          metricName={metricName}
          metricProperty={metricProperty}
        />
      )}
    </Box>
  );
}
