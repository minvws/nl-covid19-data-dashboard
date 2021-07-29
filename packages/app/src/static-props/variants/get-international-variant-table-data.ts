import { In } from '@corona-dashboard/common';
import { getVariantTableData } from './get-variant-table-data';

export function getInternationalVariantTableData(data: Record<string, In>) {
  const variantTableData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      getVariantTableData(value.variants, value.named_difference),
    ])
  );

  return { variantTableData } as const;
}
