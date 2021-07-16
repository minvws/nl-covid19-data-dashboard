import {
  assert,
  Dictionary,
  DifferenceDecimal,
  InVariants,
  NlNamedDifference,
  NlVariants,
} from '@corona-dashboard/common';
import { first } from 'lodash';
import { isDefined } from 'ts-is-present';
import { SiteText } from '~/locale';
import { colors } from '~/style/theme';

export type VariantRow = {
  variant: string;
  countryOfOrigin: string;
  occurrence: number;
  percentage: number;
  difference: DifferenceDecimal;
  color: string;
};

export type VariantTableData = ReturnType<typeof getVariantTableData>;

export function getVariantTableData(
  variants: NlVariants | InVariants | undefined,
  namedDifference: NlNamedDifference,
  countriesOfOrigin: SiteText['covid_varianten']['landen_van_herkomst']
) {
  if (!isDefined(variants) || !isDefined(variants.values)) {
    return {
      variantTable: null,
      dates: null,
      sampleSize: 0,
    } as const;
  }

  function findDifference(name: string) {
    const difference = namedDifference.variants__percentage.find(
      (x) => x.name === name
    );
    assert(difference, `No variants__percentage found for variant ${name}`);
    return difference;
  }

  function findCountryOfOrigin(name: string) {
    const countryOfOrigin = (countriesOfOrigin as Dictionary<string>)[name];
    assert(countryOfOrigin, `No country of origin found for variant ${name}`);
    return countryOfOrigin;
  }

  function findColor(name: string) {
    const color = (colors.data.variants as Dictionary<string>)[name];
    assert(color, `No color found for variant ${name}`);
    return color;
  }

  const firstLastValue = first(variants.values);
  const dates = {
    date_end_unix: firstLastValue?.last_value.date_end_unix ?? 0,
    date_start_unix: firstLastValue?.last_value.date_start_unix ?? 0,
    date_of_insertion_unix:
      firstLastValue?.last_value.date_of_insertion_unix ?? 0,
  };
  const sampleSize = firstLastValue?.last_value.sample_size ?? 0;

  const variantTable = variants.values
    .map<VariantRow>((variant) => ({
      variant: variant.name,
      countryOfOrigin: findCountryOfOrigin(variant.name),
      occurrence: variant.last_value.occurrence,
      percentage: variant.last_value.percentage,
      difference: findDifference(variant.name),
      color: findColor(variant.name),
    }))
    .sort((rowA, rowB) => {
      // Make sure the 'other' variant is always sorted last
      if (rowA.variant === 'other') {
        return 1;
      }
      if (rowB.variant === 'other') {
        return -1;
      }
      return rowB.percentage - rowA.percentage;
    });

  return { variantTable, dates, sampleSize };
}
