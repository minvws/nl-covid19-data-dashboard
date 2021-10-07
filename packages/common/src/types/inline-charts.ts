export type AreaType = 'in' | 'nl' | 'vr' | 'gm';

export type ChartConfiguration = Omit<
  Required<PartialChartConfiguration>,
  'code'
> & { code?: string };

export type PartialChartConfiguration = {
  area?: AreaType;
  metricName?: string;
  metricPropertyConfigs?: MetricPropertyConfig[];
  timeframe?: 'all' | '5weeks';
  accessibilityKey?: string;
  code?: string;
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
  labelKey: string;
};
