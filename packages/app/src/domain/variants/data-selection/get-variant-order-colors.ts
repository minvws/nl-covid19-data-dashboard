import { NlVariants, colors } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { ColorMatch, VariantCode } from '~/domain/variants/data-selection/types';

const getColorForVariant = (variantCode: VariantCode, index: number): string => {
  if (variantCode === 'other_variants') return colors.gray5;

  return colors.variants.colorList[index];
};

export const getVariantOrderColors = (variants: NlVariants | undefined): ColorMatch[] => {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return [];
  }

  const colorOrder = variants.values
    .sort((a, b) => a.last_value.order - b.last_value.order)
    .map((variant, index) => {
      const variantColor = getColorForVariant(variant.variant_code, index);
      return {
        variant: variant.variant_code,
        color: variantColor,
      };
    });

  return colorOrder;
};
