import { NlVariants } from '@corona-dashboard/common';
import { OrderMatch } from '~/domain/variants/data-selection/types';
import { isDefined } from 'ts-is-present';

export const getVariantOrders = (variants: NlVariants): OrderMatch[] => {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return [];
  }

  const order = variants.values
    .sort((a, b) => a.last_value.order - b.last_value.order)
    .map((variant) => {
      const variantOrder = variant.last_value.order;
      return {
        variant: variant.variant_code,
        order: variantOrder,
      };
    });

  return order;
};
