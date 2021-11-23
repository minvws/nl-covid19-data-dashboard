import {
  DataScopeKey,
  MetricConfiguration,
  MetricKeys,
  ScopedData,
} from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

type DataType = 'timeseries' | 'donut' | 'choropleth';

export function getDataUrl<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
>(
  startDate: string | undefined,
  endDate: string | undefined,
  configuration: MetricConfiguration<S, M>,
  type: DataType = 'timeseries'
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

  return `/api/data/${type}/${code ?? area}/${metricName}${suffix}`;
}
