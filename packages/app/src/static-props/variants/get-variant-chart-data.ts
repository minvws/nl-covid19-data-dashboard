import { NlVariants } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

export type VariantChartValue = Record<string, number> & {
  sample_size: number;
  date_start_unix: number;
  date_end_unix: number;
};

export function getVariantChartData(nlVariants: NlVariants | undefined) {
  if (!isDefined(nlVariants) || !isDefined(nlVariants.variants)) {
    return { variantChart: null } as const;
  }

  const vocVariants = nlVariants.variants.filter(
    (x) => x.last_value.is_variant_of_concern
  );
  const firstVariant = vocVariants.shift();
  if (!isDefined(firstVariant)) {
    return { variantChart: null } as const;
  }

  const values = firstVariant.values.map<VariantChartValue>((value, index) => {
    const item = {
      [`${firstVariant.name}_percentage`]: value.percentage,
      [`${firstVariant.name}_occurrence`]: value.percentage,
      date_start_unix: value.date_start_unix,
      date_end_unix: value.date_end_unix,
      sample_size: value.sample_size,
    };
    vocVariants.forEach((variant) => {
      item[`${variant.name}_percentage`] = variant.values[index].percentage;
      item[`${variant.name}_occurrence`] = variant.values[index].occurrence;
    });
    return item;
  });

  return { variantChart: values } as const;
}
