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

      if (!difference) {
        return null;
      }

      return difference;
    }
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

  const variantTable = variants.values
    .filter((variant) => variant.variant_code !== 'other_graph' && !variant.last_value.has_historical_significance)
    .sort((a, b) => b.last_value.order - a.last_value.order)
    .map<VariantRow>((variant) => {
      const color = variantColors.find((variantColor) => variantColor.variant === variant.variant_code)?.color || colors.gray5;

      return {
        variantCode: variant.variant_code,
        percentage: variant.last_value.percentage,
        difference: findDifference(variant.variant_code),
        color,
      };
    });

  return { variantTable, dates };
}
