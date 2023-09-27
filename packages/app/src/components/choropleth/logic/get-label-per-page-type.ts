import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils';

export function getLabelPerPageType(
  index: number,
  thresholdValue: ChoroplethThresholdsValue,
  thresholds: ChoroplethThresholdsValue[],
  pageType: string,
  commonTexts: SiteText['common'],
  formatNumber: (a: number) => string
) {
  let label = '';

  if (index === 0 && thresholdValue.threshold === 0) {
    if (pageType === 'sewer') {
      label = commonTexts.common.no_virus_particles_measured;
    }
    if (pageType === 'patienten-in-beeld' || pageType === 'ziekenhuis-opnames') {
      label = commonTexts.common.no_notifications;
    }
  }

  if (index === 1) {
    label = replaceVariablesInText(commonTexts.common.bigger_than_zero_and_less_than_value, {
      value_1: formatNumber(thresholds[index + 1].threshold),
    });
  }

  return label;
}
