import {
  DataScope,
  DataScopeKey,
  MetricKeys,
  MetricProperty,
  ScopedData,
} from '.';

export const areaTitles = {
  in: 'Internationaal',
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
};

export type TimespanAnnotationConfiguration = {
  fill: 'solid' | 'hatched' | 'dotted';
  start: number;
  end: number;
  labelKey?: string;
  shortLabelKey?: string;
  cutValuesForMetricProperties?: string[];
};

export type ChartConfiguration<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> = {
  area: S;
  metricName: M;
  metricProperties: MetricPropertyConfig<ScopedData[S], M>[];
  timeframe: 'all' | '5weeks';
  accessibilityKey: string;
  code?: string;
  sourceKey: string;
  valueAnnotationKey?: string;
  forcedMaximumValue?: number;
  isPercentage?: boolean;
  renderNullAsZero?: boolean;
  timespanAnnotations?: TimespanAnnotationConfiguration[];
};

export type MetricPropertyConfig<
  S extends DataScope,
  M extends MetricKeys<S>
> = {
  propertyName: MetricProperty<S, M>;
  type:
    | 'line'
    | 'gapped-line'
    | 'area'
    | 'bar'
    | 'range'
    | 'stacked-area'
    | 'gapped-stacked-area'
    | 'invisible';
  labelKey: string;
  curve?: 'linear' | 'step';
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  shortLabelKey?: string;
  mixBlendMode?: string;
};

export type KpiConfiguration = Omit<
  Required<PartialKpiConfiguration>,
  'code' | 'differenceKey'
> & { code?: string; differenceKey?: string };

export type PartialKpiConfiguration = {
  icon?: string;
  area?: DataScopeKey;
  metricName?: string;
  metricProperty?: string;
  code?: string;
  titleKey?: string;
  differenceKey?: string;
  isMovingAverageDifference?: boolean;
  isAmount?: boolean;
  sourceKey?: string;
};
