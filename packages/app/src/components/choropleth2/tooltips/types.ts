import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { DataConfig, DataOptions } from '~/components/choropleth2';
import { ChoroplethDataItem } from '~/components/choropleth2/logic';

export type TooltipSettings<T extends ChoroplethDataItem> = {
  left: number;
  top: number;
  data: TooltipData<T>;
};

export type TooltipFormatter<T extends ChoroplethDataItem> = (
  tooltipData: TooltipData<T>
) => React.ReactNode;

export type TooltipData<T extends ChoroplethDataItem> = {
  dataItem: T;
  code: string;
  metricPropertyFormatter: (value: number) => string;
  featureName: string;
  dataConfig: DataConfig<T>;
  dataOptions: DataOptions;
  thresholdValues?: ChoroplethThresholdsValue[];
};
