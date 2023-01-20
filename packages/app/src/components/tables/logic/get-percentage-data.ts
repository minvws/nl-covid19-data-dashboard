import { createFormatting } from '@corona-dashboard/common';
import { PercentageDataPoint } from '../types';

type FormatParam = { shouldFormat?: boolean };
type PercentageFormattingParams = { first: FormatParam; second: FormatParam };
type TrendDirectionParams = { first: string; second: string };
type ColorParam = { first: string; second: string };
type TitleParam = { first: string; second: string };

// Returns an array of objects corresponding to percentage data used by tables on the dashboard
export const getPercentageData = (
  dataset: any[], // TODO:AP - figure out how to properly type this
  title: TitleParam,
  color: ColorParam,
  percentageFormattingRules: PercentageFormattingParams,
  trendDirection?: TrendDirectionParams,
  noDataText?: string,
  formatPercentage?: ReturnType<typeof createFormatting>['formatPercentage']
): PercentageDataPoint[][] => {
  const getFormattedPercentageValue = (percentage: number | null) => {
    if (formatPercentage === undefined) return;

    return percentage !== null ? `${formatPercentage(percentage)}%` : noDataText;
  };

  return dataset.map((datasetItem) => {
    return [
      {
        title: title.first,
        trendDirection: trendDirection?.first !== undefined && trendDirection.first in datasetItem ? datasetItem[trendDirection.first] : null,
        percentage: {
          color: color.first,
          value: percentageFormattingRules.first.shouldFormat ? getFormattedPercentageValue(datasetItem.firstPercentage) : datasetItem.firstPercentage,
        },
      },
      {
        title: title.second,
        trendDirection: trendDirection?.second !== undefined && trendDirection.second in datasetItem ? datasetItem[trendDirection.second] : null,
        percentage: {
          color: color.second,
          value: percentageFormattingRules.second.shouldFormat ? getFormattedPercentageValue(datasetItem.secondPercentage) : datasetItem.secondPercentage,
        },
      },
    ];
  });
};
