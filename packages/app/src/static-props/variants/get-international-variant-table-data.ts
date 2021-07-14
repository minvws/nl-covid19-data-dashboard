import { In } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { getVariantTableData } from './get-variant-table-data';

export function getInternationalVariantTableData(
  data: Record<string, In>,
  variantTranslations: SiteText['covid_varianten']['varianten']
) {
  const variantTableData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      getVariantTableData(
        value.variants,
        value.named_difference,
        variantTranslations
      ),
    ])
  );

  return { variantTableData } as const;
}
