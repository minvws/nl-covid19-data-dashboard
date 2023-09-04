import { ChoroplethThresholdsValue, colors } from '@corona-dashboard/common';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from './base';
import { Legend, LegendItem } from './legend';
import { Text } from './typography';

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

  const legendItems = thresholds.map((x: ChoroplethThresholdsValue, i) => {
    let label = thresholds[i + 1]
      ? replaceVariablesInText(commonTexts.common.value_until_value, {
          value_1: formatNumber(x.threshold),
          value_2: formatNumber(thresholds[i + 1].threshold),
        })
      : replaceVariablesInText(commonTexts.common.value_and_higher, {
          value: formatNumber(x.threshold),
        });

    switch (pageType) {
      case 'sewer':
        if (i === 0 && x.threshold === 0) {
          label = commonTexts.common.no_virus_particles_measured;
        } else if (i === 1) {
          label = replaceVariablesInText(commonTexts.common.bigger_than_zero_and_less_than_value, {
            value_1: formatNumber(thresholds[i + 1].threshold),
          });
        }
        break;
      case 'patienten-in-beeld' || 'ziekenhuis-opnames':
        if (i === 0 && x.threshold === 0) {
          label = commonTexts.common.no_notifications;
        } else if (i === 1) {
          label = replaceVariablesInText(commonTexts.common.bigger_than_zero_and_less_than_value, {
            value_1: formatNumber(thresholds[i + 1].threshold),
          });
        }
        break;
    }
    return {
      label: label,
      shape: 'square',
      color: x.color,
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
