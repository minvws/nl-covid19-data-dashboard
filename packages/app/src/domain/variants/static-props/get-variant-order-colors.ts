import { NlVariants, colors } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { VariantCode } from './';

export type ColorMatch = {
  variant: VariantCode;
  color: string;
};

const getColorForVariant = (variantCode: VariantCode, index: number): string => {
  if (variantCode === 'other_table') return colors.gray5;
  if (variantCode === 'other_graph') return colors.gray5;

  return colors.variants.colorList[index];
};

export const getVariantOrderColors = (variants: NlVariants | undefined): ColorMatch[] => {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return [];
  }

  const colorOrder = variants.values
    .filter((variant) => variant.last_value.is_variant_of_concern || variant.last_value.has_historical_significance)
    .sort((a, b) => (a.variant_code.includes('other') || b.variant_code.includes('other') ? -1 : a.last_value.order - b.last_value.order))
    .map((variant, index) => {
      const variantColor = getColorForVariant(variant.variant_code, index);
      return {
        variant: variant.variant_code,
        color: variantColor,
      };
    });

  return colorOrder;
};
