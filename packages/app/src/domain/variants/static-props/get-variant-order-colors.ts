import { NlVariants, colors } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';

type SingleColorMatchType = {
  variant: string;
  color: string;
};

export type colorMatch = SingleColorMatchType[];

export function getVariantOrderColors(
  variants: NlVariants | undefined
): colorMatch {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return [];
  }

  const variantsOfConcern = variants.values
    .filter(
      (x) =>
        x.last_value.is_variant_of_concern ||
        x.last_value.has_historical_significance
    )
    .sort((a, b) => b.last_value.order - a.last_value.order);

  const firstVariant = variantsOfConcern.shift();

  if (!isDefined(firstVariant)) {
    return [];
  }

  const colorMatch = variantsOfConcern.map((variant, index) => {
    return {
      variant: variant.variant_code,
      color:
        variant.variant_code === 'other_table'
          ? colors.data.variants.other_table
          : variant.variant_code === 'other_graph'
          ? colors.data.variants.other_graph
          : colors.data.variants.colorList[index],
    };
  });

  return colorMatch;
}
