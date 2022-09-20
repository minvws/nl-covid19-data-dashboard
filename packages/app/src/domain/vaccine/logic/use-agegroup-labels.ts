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
  const { commonTexts, formatPercentage } = useIntl();
  const labelsText = commonTexts.common;

  return useMemo(() => {
    const fullyVaccinatedLabel = isDefined(dataValue)
      ? getRenderedVaccinatedLabel(
          dataValue.fully_vaccinated_percentage_label,
          dataValue.fully_vaccinated_percentage,
          labelsText.meer_dan,
          labelsText.minder_dan,
          formatPercentage
        )
      : '0';
    const oneShotLabel = isDefined(dataValue)
      ? getRenderedVaccinatedLabel(
          dataValue.autumn_2022_vaccinated_percentage_label,
          dataValue.autumn_2022_vaccinated_percentage,
          labelsText.meer_dan,
          labelsText.minder_dan,
          formatPercentage
        )
      : '0';

    return {
      fully_vaccinated_percentage: lowerCased
        ? fullyVaccinatedLabel.toLocaleLowerCase()
        : fullyVaccinatedLabel,
      autumn_2022_vaccinated_percentage: lowerCased
        ? oneShotLabel.toLocaleLowerCase()
        : oneShotLabel,
    };
  }, [
    dataValue,
    labelsText.meer_dan,
    labelsText.minder_dan,
    formatPercentage,
    lowerCased,
  ]);
}
