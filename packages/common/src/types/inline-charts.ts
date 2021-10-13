export const areaTitles = {
  in: 'Internationaal',
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
};

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
  sourceKey?: string;
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
