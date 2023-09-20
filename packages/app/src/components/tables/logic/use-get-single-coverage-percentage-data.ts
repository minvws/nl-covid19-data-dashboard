import { useIntl } from '~/intl';
import { PercentageDataPoint, SingleCoverageTableData } from '../types';

type FormatParam = { shouldFormat: boolean };
type PercentageFormattingParams = { first: FormatParam; second: FormatParam };
type ColorParam = { first: string; second: string };
type TitleParam = { first: string; second: string };

// Returns an array of objects corresponding to percentage data used by tables on the dashboard
export const useGetSingleCoveragePercentageData = (
  dataset: SingleCoverageTableData[],
  title: TitleParam,
  color: ColorParam,
  percentageFormattingRules?: PercentageFormattingParams
): PercentageDataPoint[][] => {
  const { commonTexts, formatPercentage } = useIntl();

  const getFormattedPercentageValue = (percentage: number | null, shouldFormat: boolean) => {
    return percentage === null ? commonTexts.common.no_data : shouldFormat ? `${formatPercentage(percentage)}%` : percentage;
  };

  return dataset.map((datasetItem) => {
    return [
      {
        title: title.first,
        trendDirection: 'firstPercentageTrend' in datasetItem ? datasetItem['percentageTrend'] : null,
        percentage: {
          color: color.first,
          value: getFormattedPercentageValue(datasetItem.percentage, percentageFormattingRules?.first.shouldFormat ?? false),
        },
      },
    ];
  });
};
