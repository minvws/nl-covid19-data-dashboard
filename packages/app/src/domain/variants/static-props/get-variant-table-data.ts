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

  function findDifference(name: string) {
    if (isPresent(namedDifference.variants__percentage)) {
      const difference = namedDifference.variants__percentage.find((x) => x.variant_code === name);

      return difference ?? null;
    }
  }

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
    .filter((namedDifferencePercentage) => mapVariantToNamedDifference(namedDifferencePercentage.variant_code) !== null)
    .sort((a, b) => mapVariantToNamedDifference(b.variant_code)!.last_value.order - mapVariantToNamedDifference(a.variant_code)!.last_value.order)
    .map<VariantRow>((namedDifferenceEntry) => {
      const color = variantColors.find((variantColor) => variantColor.variant === namedDifferenceEntry.variant_code)?.color || colors.gray5;

      return {
        variantCode: namedDifferenceEntry.variant_code,
        percentage: mapVariantToNamedDifference(namedDifferenceEntry.variant_code)?.last_value.percentage as unknown as number,
        difference: findDifference(namedDifferenceEntry.variant_code),
        color,
      };
    });

  return { variantTable, dates };
}
