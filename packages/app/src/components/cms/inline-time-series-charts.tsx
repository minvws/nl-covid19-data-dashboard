import {
  ChartConfiguration,
  DataScopeKey,
  MetricKeys,
  ScopedData,
  TimespanAnnotationConfiguration,
  TimestampedValue,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { ErrorBoundary } from '~/components/error-boundary';
import { TimeSeriesChart } from '~/components/time-series-chart';
import {
  DataOptions,
  TimespanAnnotationConfig,
} from '~/components/time-series-chart/logic/common';
import { useIntl } from '~/intl';
import { metricConfigs } from '~/metric-config';
import { ScopedMetricConfigs } from '~/metric-config/common';
import { getBoundaryDateStartUnix } from '~/utils/get-boundary-date-start-unix';
import { getLowerBoundaryDateStartUnix } from '~/utils/get-lower-boundary-date-start-unix';
import { Metadata } from '../metadata';
import { InlineLoader } from './inline-loader';
import { getColor } from './logic/get-color';
import { getDataUrl } from './logic/get-data-url';

interface InlineTimeSeriesChartsProps<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> {
  startDate?: string;
  endDate?: string;
  configuration: ChartConfiguration<S, M>;
}

export function InlineTimeSeriesCharts<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
>(props: InlineTimeSeriesChartsProps<S, M>) {
  const { configuration, startDate, endDate } = props;
  const { siteText } = useIntl();

  const dateUrl = getDataUrl(startDate, endDate, configuration);

  const { data } = useSWRImmutable(dateUrl, (url: string) =>
    fetch(url).then((_) => _.json())
  );

  const scopedMetricConfigs = metricConfigs[configuration.area] as
    | ScopedMetricConfigs<ScopedData[S]>
    | undefined;

  const seriesConfig = useMemo(() => {
    return configuration.metricProperties.map((x) => {
      const seriesMetricConfig =
        scopedMetricConfigs?.[configuration.metricName]?.[x.propertyName];
      const config: any = {
        type: x.type,
        metricProperty: x.propertyName,
        label: get(siteText, x.labelKey.split('.'), null),
        color: getColor(x.color),
        minimumRange: seriesMetricConfig?.minimumRange,
      };
      if (isDefined(x.curve) && x.curve.length) {
        config.curve = x.curve;
      }
      if (isDefined(x.fillOpacity)) {
        config.fillOpacity = x.fillOpacity;
      }
      if (isDefined(x.shortLabelKey) && x.shortLabelKey.length) {
        config.shortLabelKey = get(siteText, x.shortLabelKey.split('.'), null);
      }
      if (isDefined(x.strokeWidth)) {
        config.strokeWidth = x.strokeWidth;
      }
      if (isDefined(x.mixBlendMode)) {
        config.mixBlendMode = x.mixBlendMode;
      }
      return config;
    });
  }, [
    scopedMetricConfigs,
    configuration.metricName,
    configuration.metricProperties,
    siteText,
  ]);

  const dataOptions = useMemo(() => {
    if (!isDefined(configuration) || !isDefined(data)) {
      return undefined;
    }

    const annotations = configuration.timespanAnnotations ?? [];
    const timespanAnnotations = annotations.map<TimespanAnnotationConfig>(
      (x: TimespanAnnotationConfiguration) => ({
        fill: x.fill,
        start: calculateStart(x.start, data.values),
        end: calculateEnd(x.end, x.start, data.values),
        label: isDefined(x.labelKey)
          ? get(siteText, x.labelKey.split('.'), null)
          : undefined,
        shortLabel: isDefined(x.shortLabelKey)
          ? get(siteText, x.shortLabelKey.split('.'), null)
          : undefined,
      })
    );

    return {
      forcedMaximumValue: configuration.forcedMaximumValue,
      isPercentage: configuration.isPercentage,
      renderNullAsZero: configuration.renderNullAsZero,
      valueAnnotation: configuration.valueAnnotationKey?.length
        ? get(siteText, configuration.valueAnnotationKey.split('.'), undefined)
        : undefined,
      timespanAnnotations,
    } as DataOptions;
  }, [configuration, siteText, data]);

  if (!isDefined(data)) {
    return <InlineLoader />;
  }

  const source = get(siteText, configuration.sourceKey.split('.'), '');

  return (
    <ErrorBoundary>
      <TimeSeriesChart
        accessibility={{ key: configuration.accessibilityKey as any }}
        values={data.values}
        seriesConfig={seriesConfig}
        timeframe={configuration.timeframe}
        dataOptions={dataOptions}
      />
      <Metadata source={source} isTileFooter />
    </ErrorBoundary>
  );
}

function calculateStart(start: number, values: TimestampedValue[]) {
  if (start < 0) {
    return getBoundaryDateStartUnix(values, Math.abs(start));
  }
  return getLowerBoundaryDateStartUnix(values, start);
}

function calculateEnd(end: number, start: number, values: TimestampedValue[]) {
  if (start < 0) {
    return Infinity;
  }
  return getLowerBoundaryDateStartUnix(values, end);
}
