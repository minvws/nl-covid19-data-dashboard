import { createFormatting } from "@corona-dashboard/common";
import { PercentageDataPoint } from "../components/percentage-data";

type percentageParam = { propertyKey: string, shouldFormat?: boolean };
type percentageParams = { first: percentageParam, second: percentageParam };
type trendDirectionParams = { first: percentageParam, second: percentageParam };
type colorParam = { first: string, second: string };
type titleParam = { first: string, second: string };

// Returns an array of objects corresponding to percentage data used by tables on the dashboard
export const getPercentageData = (
  dataset: any[], // TODO:AP - figure out how to properly type this
  title: titleParam,
  color: colorParam,
  percentageKeys: percentageParams,
  trendDirection?: trendDirectionParams,
  noDataText?: string,
  formatPercentage?: ReturnType<typeof createFormatting>['formatPercentage']
): PercentageDataPoint[][] => {
  const getPercentageValue = (datasetItem: any, percentageItem: percentageParam) => {
    if (formatPercentage === undefined) return;

    return typeof percentageItem !== 'number' && datasetItem[percentageItem.propertyKey] !== null
      ? `${formatPercentage(datasetItem[percentageItem.propertyKey])}%` 
      : noDataText;
  }

  return dataset.map((datasetItem) => {
    return [
      {
        title: title.first,
        trendDirection: trendDirection?.first.propertyKey !== undefined && trendDirection.first.propertyKey in datasetItem ? datasetItem[trendDirection.first.propertyKey] : null,
        percentage: {
          color: color.first,
          value: percentageKeys.first.shouldFormat ? getPercentageValue(datasetItem, percentageKeys.first) : datasetItem[percentageKeys.first.propertyKey],
        },
      },
      {
        title: title.second,
        trendDirection: trendDirection?.second.propertyKey !== undefined && trendDirection.second.propertyKey in datasetItem ? datasetItem[trendDirection.second.propertyKey] : null,
        percentage: {
          color: color.second,
          value: percentageKeys.second.shouldFormat ? getPercentageValue(datasetItem, percentageKeys.second) : datasetItem[percentageKeys.second.propertyKey],
        },
      },
    ];
  });
};
