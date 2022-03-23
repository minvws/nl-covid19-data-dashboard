import { TimeframeOption } from '~/utils';
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

export type ChoroplethConfiguration<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> = {
  metricProperty: MetricProperty<ScopedData[S], MetricKeys<ScopedData[S]>>;
  map: 'in' | 'vr' | 'gm';
  accessibilityKey: string;
  sourceKey: string;
  noDataFillColor?: string;
  hoverFill?: string;
  hoverStroke?: string;
  hoverStrokeWidth?: number;
  highlightStroke?: string;
  highlightStrokeWidth?: number;
  areaStroke?: string;
  areaStrokeWidth?: number;
  isPercentage?: boolean;
  highlightSelection?: boolean;
  selectedCode?: string;
  link?: string;
  tooltipVariables?: string;
} & MetricConfiguration<S, M>;

export type MetricConfiguration<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> = {
  area: S;
  metricName: M;
  code?: string;
};

export type DonutChartConfiguration<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> = {
  icon: string;
  labelKey: string;
  sourceKey: string;
  metricProperties: DonutMetricPropertyConfig<ScopedData[S], M>[];
  paddingLeft?: number;
  innerSize?: number;
  donutWidth?: number;
  padAngle?: number;
  minimumPercentage?: number;
  verticalLayout?: boolean;
} & MetricConfiguration<S, M>;

export type DonutMetricPropertyConfig<
  S extends DataScope,
  M extends MetricKeys<S>
> = {
  propertyName: MetricProperty<S, M>;
  color: string;
  labelKey: string;
  tooltipLabelKey: string;
};

export type AgeDemographicConfiguration<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> = {
  accessibilityKey: string;
  sourceKey: string;
  text: string;
  leftMetricProperty: MetricProperty<ScopedData[S], MetricKeys<ScopedData[S]>>;
  rightMetricProperty: MetricProperty<ScopedData[S], MetricKeys<ScopedData[S]>>;
  leftColor: string;
  rightColor: string;
  maxDisplayValue?: number;
} & MetricConfiguration<S, M>;

export type ChartConfiguration<
  S extends DataScopeKey,
  M extends MetricKeys<ScopedData[S]>
> = {
  metricProperties: MetricPropertyConfig<ScopedData[S], M>[];
  timeframe: TimeframeOption;
  accessibilityKey: string;
  sourceKey: string;
  valueAnnotationKey?: string;
  forcedMaximumValue?: number;
  isPercentage?: boolean;
  renderNullAsZero?: boolean;
  timespanAnnotations?: TimespanAnnotationConfiguration[];
} & MetricConfiguration<S, M>;

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
