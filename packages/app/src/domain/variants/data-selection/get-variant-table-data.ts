import { colors, NlNamedDifference, NlVariants, NlVariantsVariant } from '@corona-dashboard/common';
import { first } from 'lodash';
import { isDefined } from 'ts-is-present';
import { ColorMatch, VariantRow } from '~/domain/variants/data-selection/types';

/**
 * Return values to populate the variants table
 * @param variants
 * @param namedDifference
 * @param variantColors
 */
export function getVariantTableData(variants: NlVariants | undefined, namedDifference: NlNamedDifference, variantColors: ColorMatch[]) {
  const emptyValues = {
    variantTable: null,
    dates: {
      date_of_report_unix: 0,
      date_start_unix: 0,
      date_end_unix: 0,
    },
  } as const;

  if (!isDefined(variants) || !isDefined(variants.values)) {
    return emptyValues;
  }

  const firstLastValue = first<NlVariantsVariant>(variants.values);

  if (!isDefined(firstLastValue)) {
    return emptyValues;
  }
  const dates = {
    date_end_unix: firstLastValue.last_value.date_end_unix,
    date_start_unix: firstLastValue.last_value.date_start_unix,
    date_of_report_unix: firstLastValue.last_value.date_of_report_unix,
  };

  /**
   * Reverse order of variants to what is received from the master table
   * Move 'other variants' all the way to the bottom of the table
   */
  const variantTable = namedDifference.variants__percentage
    .map<VariantRow>((namedDifferenceEntry) => {
      // There is ALWAYS a corresponding variant to a namedDifference entry.
      const variant = variants.values.find((x) => x.variant_code === namedDifferenceEntry.variant_code)!;

      return {
        variantCode: namedDifferenceEntry.variant_code,
        order: variant.last_value.order,
        percentage: variant.last_value.percentage,
        difference: namedDifferenceEntry,
        color: variantColors.find((variantColor) => variantColor.variant === namedDifferenceEntry.variant_code)?.color || colors.gray5,
      };
    })
    .sort((a, b) => {
      // Other Variants must always take the bottom row in the table
      if (a.variantCode === 'other_variants') return 1;
      if (b.variantCode === 'other_variants') return -1;
      return b.order - a.order;
    });

  return { variantTable, dates };
}
