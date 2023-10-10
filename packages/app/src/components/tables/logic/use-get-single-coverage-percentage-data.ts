import { useIntl } from '~/intl';
import { PercentageDataPoint, SingleCoverageTableData } from '../types';

type FormatParam = { shouldFormat: boolean };

// Returns an array of objects corresponding to percentage data used by tables on the dashboard
export const useGetSingleCoveragePercentageData = (
  dataset: SingleCoverageTableData[],
  title: string,
  color: string,
  percentageFormattingRules?: FormatParam
): PercentageDataPoint[][] => {
  const { commonTexts, formatPercentage } = useIntl();

  const getFormattedPercentageValue = (percentage: number | null, shouldFormat: boolean) => {
    return percentage === null ? commonTexts.common.no_data : shouldFormat ? `${formatPercentage(percentage)}%` : percentage;
  };

  return dataset.map((datasetItem) => {
    return [
      {
        title: title,
        trendDirection: 'firstPercentageTrend' in datasetItem ? datasetItem['firstPercentageTrend'] : null,
        percentage: {
          color: color,
          value: getFormattedPercentageValue(datasetItem.firstPercentage, percentageFormattingRules?.shouldFormat ?? false),
        },
      },
    ];
  });
};
