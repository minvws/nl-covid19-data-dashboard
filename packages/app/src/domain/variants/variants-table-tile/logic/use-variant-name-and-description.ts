import { assert, Dictionary } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function useVariantNameAndDescription(
  variant: string,
  otherDescription: string
) {
  const { siteText } = useIntl();

  const variantName = (
    siteText.covid_varianten.varianten as Dictionary<string>
  )[variant];

  const variantDescription =
    variant === 'other'
      ? otherDescription
      : (siteText.covid_varianten.varianten_omschrijving as Dictionary<string>)[
          variant
        ];

  const countryOfOrigin = (
    siteText.covid_varianten.landen_van_herkomst as Dictionary<string>
  )[variant];

  assert(variantName, `No translation found for variant ${variant}`);
  assert(variantDescription, `No tooltip found for variant ${variant}`);
  assert(countryOfOrigin, `No country of origin found for variant ${variant}`);

  return [
    variantName,
    replaceVariablesInText(variantDescription, {
      variantName,
      countryOfOrigin,
    }),
  ] as const;
}
