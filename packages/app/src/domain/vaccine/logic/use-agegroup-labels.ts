import {
  GmVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { getRenderedVaccinatedLabel } from './parse-vaccinated-percentage-label';

export function useAgegroupLabels(
  dataValue:
    | VrVaccineCoveragePerAgeGroupValue
    | GmVaccineCoveragePerAgeGroupValue
    | undefined,
  lowerCased?: boolean
) {
  const { siteText, formatPercentage } = useIntl();

  return useMemo(() => {
    const fullyVaccinatedLabel = isDefined(dataValue)
      ? getRenderedVaccinatedLabel(
          dataValue.fully_vaccinated_percentage_label,
          dataValue.fully_vaccinated_percentage,
          siteText.vaccinaties_common.labels.meer_dan,
          siteText.vaccinaties_common.labels.minder_dan,
          formatPercentage
        )
      : '0';
    const oneShotLabel = isDefined(dataValue)
      ? getRenderedVaccinatedLabel(
          dataValue.has_one_shot_percentage_label,
          dataValue.has_one_shot_percentage,
          siteText.vaccinaties_common.labels.meer_dan,
          siteText.vaccinaties_common.labels.minder_dan,
          formatPercentage
        )
      : '0';

    return {
      fully_vaccinated_percentage: lowerCased
        ? fullyVaccinatedLabel.toLocaleLowerCase()
        : fullyVaccinatedLabel,
      has_one_shot_percentage: lowerCased
        ? oneShotLabel.toLocaleLowerCase()
        : oneShotLabel,
    };
  }, [dataValue, siteText, formatPercentage]);
}
