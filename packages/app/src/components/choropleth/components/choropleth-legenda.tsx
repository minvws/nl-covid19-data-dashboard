import { ChoroplethThresholdsValue, colors } from '@corona-dashboard/common';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from '../../base';
import { Legend, LegendItem } from '../../legend';
import { Text } from '../../typography';
import { getLabelPerPageType } from '../logic/get-label-per-page-type';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
  valueAnnotation?: string;
  pageType?: string;
  outdatedDataLabel?: string;
}

export function ChoroplethLegenda({ title, thresholds, valueAnnotation, pageType, outdatedDataLabel }: ChoroplethLegendaProps) {
  const { commonTexts, formatNumber } = useIntl();

  const breakpoints = useBreakpoints(true);

  const legendItems = thresholds.map((thresholdValue: ChoroplethThresholdsValue, index) => {
    let label = thresholds[index + 1]
      ? replaceVariablesInText(commonTexts.common.value_until_value, {
          value_1: formatNumber(thresholdValue.threshold),
          value_2: formatNumber(thresholds[index + 1].threshold),
        })
      : replaceVariablesInText(commonTexts.common.value_and_higher, {
          value: formatNumber(thresholdValue.threshold),
        });

    if ((index === 0 || index === 1) && pageType) {
      label = getLabelPerPageType(index, thresholdValue, thresholds, pageType, commonTexts, formatNumber);
    }

    return {
      label: label,
      shape: 'square',
      color: thresholdValue.color,
    } as LegendItem;
  });

  if (pageType === 'sewer') {
    legendItems.unshift({
      label: outdatedDataLabel,
      shape: 'square',
      color: colors.yellow1,
    } as LegendItem);
  }

  return (
    <Box width="100%" spacing={2} aria-hidden="true">
      {title && <Text variant="subtitle1">{title}</Text>}

      <Legend items={legendItems} columns={breakpoints.lg ? 1 : 2} />
      <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
    </Box>
  );
}
