import { In } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { getVariantTableData } from './get-variant-table-data';

export function getInternationalVariantTableData(
  inData: Record<string, In>,
  variantTranslations: SiteText['covid_varianten']['varianten']
) {
  const variantTableData = Object.fromEntries(
    Object.entries(inData).map(([key, value]) => [
      key,
      getVariantTableData(
        value.variants,
        value.named_difference,
        variantTranslations
      ).variantTable,
    ])
  );

  return { variantTableData } as const;
}
