import { TimestampedValue } from '@corona-dashboard/common';
import { last } from 'lodash';
import { countTrailingNullValues } from '../count-trailing-null-values';

const metricsInaccurateItems = ['intensive_care_nice', 'hospital_nice'];
const strippableMetricProperties = [
  'admissions_on_date_of_admission_moving_average_rounded',
  'admissions_on_date_of_admission_moving_average',
];

export function stripTrailingNullValues(
  data: { values: TimestampedValue[]; last_value: TimestampedValue },
  metric: string,
  metricProperty?: keyof TimestampedValue
) {
  if (
    !metricsInaccurateItems.includes(metric) ||
    !strippableMetricProperties.includes(metricProperty ?? '')
  ) {
    return data;
  }

  const count = countTrailingNullValues(data.values, metricProperty);

  if (count === 0) {
    return data;
  }

  const values = data.values.slice(0, -count);

  return {
    values,
    last_value: last(values),
  };
}
