import {
  DataScopeKey,
  MetricConfiguration,
  MetricKeys,
  ScopedData,
} from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

export function getDataUrl<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
>(
  startDate: string | undefined,
  endDate: string | undefined,
  configuration: MetricConfiguration<S, M>
) {
  const { code, area, metricName } = configuration;
  const qParams = [];

  if (isDefined(startDate)) {
    qParams.push(`start=${startDate}`);
  }

  if (isDefined(endDate)) {
    qParams.push(`end=${endDate}`);
  }

  const suffix = qParams.length ? `?${qParams.join('&')}` : '';

  return `/api/data/timeseries/${code ?? area}/${metricName}${suffix}`;
}
