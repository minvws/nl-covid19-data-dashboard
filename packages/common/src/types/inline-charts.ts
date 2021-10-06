export type AreaType = 'in' | 'nl' | 'vr' | 'gm';

export type ChartConfiguration = Required<PartialChartConfiguration>;

type PartialChartConfiguration = {
  area?: AreaType;
  metricName?: string;
  metricPropertyConfigs?: MetricPropertyConfig[];
  timeframe?: 'all' | '5weeks';
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
  curve?: 'linear' | 'step';
};
