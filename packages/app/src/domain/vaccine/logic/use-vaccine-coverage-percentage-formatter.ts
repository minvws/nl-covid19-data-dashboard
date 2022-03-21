import { createFormatting } from '@corona-dashboard/common';
import { isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { parseVaccinatedPercentageLabel } from './parse-vaccinated-percentage-label';

// All property keys of T that also have a ${property}_label in T
export type KeyWithLabel<T> = {
  [P in keyof T]: `${string & P}_label` extends keyof T ? P : never;
}[keyof T];

// All properties that also have a ${property}_label in T
// Accept other properties as well, but as unknown
type PropertiesWithLabel<T> = {
  [P in keyof T]: `${string & P}_label` extends keyof T ? T[P] : unknown;
};

// All ${property}_label in T
type Labels<T> = {
  [P in keyof T as `${string & P}_label`]?: `${string &
    P}_label` extends keyof T
    ? string | null
    : never;
};

// All properties with labels and those labels in T
type DataWithLabels<T> = PropertiesWithLabel<T> & Labels<T>;

export function useVaccineCoveragePercentageFormatter(numFractionDigits = 0) {
  const { commonTexts, formatPercentage } = useIntl();

  return getVaccineCoveragePercentageFormatter(
    commonTexts.common,
    formatPercentage,
    numFractionDigits
  );
}

function getVaccineCoveragePercentageFormatter(
  text: SiteText['common']['common'],
  formatPercentage: ReturnType<typeof createFormatting>['formatPercentage'],
  numFractionDigits: number
) {
  return <T extends DataWithLabels<T>>(data: T, property: KeyWithLabel<T>) => {
    const labelKey = `${property}_label` as keyof T;

    if (
      labelKey in data &&
      isPresent(data[labelKey]) &&
      typeof data[labelKey] === 'string'
    ) {
      const parsedLabel = parseVaccinatedPercentageLabel(
        data[labelKey] as unknown as string
      );
      if (isPresent(parsedLabel)) {
        const content =
          parsedLabel.sign === '>' ? text.meer_dan : text.minder_dan;
        return replaceVariablesInText(content, {
          value:
            formatPercentage(parsedLabel.value, {
              minimumFractionDigits: numFractionDigits,
              maximumFractionDigits: numFractionDigits,
            }) + '%',
        });
      }
    }

    if (isPresent(data[property]) && typeof data[property] === 'number') {
      return (
        formatPercentage(data[property] as unknown as number, {
          minimumFractionDigits: numFractionDigits,
          maximumFractionDigits: numFractionDigits,
        }) + '%'
      );
    }

    return '–';
  };
}
