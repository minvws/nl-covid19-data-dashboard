import { assert, Dictionary } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function useVariantNameAndDescription(
  variant: string,
  otherDescription: string
) {
  const { siteText } = useIntl();

  const variantName = (
    siteText.pages.variantsPage.nl.varianten as Dictionary<string>
  )[variant];

  const variantDescription =
    variant === 'other_table'
      ? otherDescription
      : (
          siteText.pages.variantsPage.nl
            .varianten_omschrijving as Dictionary<string>
        )[variant];

  const countryOfOrigin = (
    siteText.pages.variantsPage.nl.landen_van_herkomst as Dictionary<string>
  )[variant];

  assert(
    variantName,
    `[${useVariantNameAndDescription.name}] No translation found for variant ${variant}`
  );
  assert(
    variantDescription,
    `[${useVariantNameAndDescription.name}] No tooltip found for variant ${variant}`
  );
  assert(
    countryOfOrigin,
    `[${useVariantNameAndDescription.name}] No country of origin found for variant ${variant}`
  );

  return [
    variantName,
    replaceVariablesInText(variantDescription, {
      variantName,
      countryOfOrigin,
    }),
  ] as const;
}
