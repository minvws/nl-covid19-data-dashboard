import { NlVariants, colors } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { VariantCode } from './'

type SingleColorMatchType = {
  variant: VariantCode;
  color: string;
};

export type ColorMatch = SingleColorMatchType[];

const getColorForVariant = (variantCode: VariantCode, index: number): string => {
  if (variantCode === 'other_table') return colors.data.variants.other_table;
  if (variantCode === 'other_graph') return colors.data.variants.other_graph;

  return colors.data.variants.colorList[index];
}

export function getVariantOrderColors(
  variants: NlVariants | undefined
): ColorMatch {
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

  const colorOrder = variantsOfConcern.map((variant, index) => {
    const variantColor = getColorForVariant(variant.variant_code, index)
    return {
      variant: variant.variant_code,
      color: variantColor
    };
  });

  return colorOrder;
}
