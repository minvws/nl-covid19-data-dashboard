import { colors, NlNamedDifference, NlVariants, NlVariantsVariant, NamedDifferenceDecimal } from '@corona-dashboard/common';
import { first } from 'lodash';
import { isDefined, isPresent } from 'ts-is-present';
import { ColorMatch } from './get-variant-order-colors';
import { VariantCode } from '../static-props';

export type VariantRow = {
  variantCode: VariantCode;
  percentage: number | null;
  difference?: NamedDifferenceDecimal | null;
  color: string;
};

export type VariantTableData = ReturnType<typeof getVariantTableData>;

/**
 *  Return values to populate the variants table on the variants page
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

  /**
   *  Find the difference property of the named difference key with a matching variant code and return
   * @param name
   */
  function findDifference(name: string) {
    if (isPresent(namedDifference.variants__percentage)) {
      const difference = namedDifference.variants__percentage.find((x) => x.variant_code === name);

      return difference ?? null;
    }
  }

  /**
   *  Find the property with a matching variant code in the 'variant' key of the NL json and return
   * @param namedDifferenceVariantCode
   */
  function mapVariantToNamedDifference(namedDifferenceVariantCode: string) {
    return variants?.values.find((x) => x.variant_code === namedDifferenceVariantCode) ?? null;
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

  const variantTable = namedDifference.variants__percentage
    .filter((variant) => mapVariantToNamedDifference(variant.variant_code) !== null)
    .sort((a, b) => mapVariantToNamedDifference(b.variant_code)!.last_value.order - mapVariantToNamedDifference(a.variant_code)!.last_value.order)
    .map<VariantRow>((variant) => {
      const color = variantColors.find((variantColor) => variantColor.variant === variant.variant_code)?.color || colors.gray5;

      return {
        variantCode: variant.variant_code,
        percentage: mapVariantToNamedDifference(variant.variant_code)?.last_value.percentage as unknown as number,
        difference: findDifference(variant.variant_code),
        color,
      };
    });

  return { variantTable, dates };
}
