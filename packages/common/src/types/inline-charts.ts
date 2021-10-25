export const areaTitles = {
  in: 'Internationaal',
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
};

export type AreaType = 'in' | 'nl' | 'vr' | 'gm';

export type TimespanAnnotationConfiguration = {
  fill: 'solid' | 'hatched' | 'dotted';
  start: number;
  end: number;
  labelKey?: string;
  shortLabelKey?: string;
  cutValuesForMetricProperties?: string[];
};

export type InlineChart = {
  startDate?: string;
  endDate?: string;
  title: string;
  config: ChartConfiguration;
};

export type ChartConfiguration = {
  area: AreaType;
  metricName: string;
  metricProperties: MetricPropertyConfig[];
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

export type MetricPropertyConfig = {
  propertyName: string;
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
  area?: AreaType;
  metricName?: string;
  metricProperty?: string;
  code?: string;
  titleKey?: string;
  differenceKey?: string;
  isMovingAverageDifference?: boolean;
  isAmount?: boolean;
  sourceKey?: string;
};
