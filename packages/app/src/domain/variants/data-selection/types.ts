import { SiteText } from '~/locale';
import { NamedDifferenceDecimal, TimestampedValue } from '@corona-dashboard/common';
import { getVariantTableData } from '~/domain/variants/data-selection/get-variant-table-data';

export type VariantCode = string;

export type ColorMatch = {
  variant: VariantCode;
  color: string;
};

export type VariantTableData = ReturnType<typeof getVariantTableData>;

export type VariantChartValue = {
  date_start_unix: number;
  date_end_unix: number;
  is_reliable: boolean;
} & Record<string, number>;

export type VariantRow = {
  variantCode: VariantCode;
  order: number;
  percentage: number | null;
  difference?: NamedDifferenceDecimal | null;
  color: string;
};

export type VariantDynamicLabels = Record<string, string>;

export type VariantsOverTimeGraphText = SiteText['pages']['variants_page']['nl']['varianten_over_tijd_grafiek'];

export type VariantsStackedAreaTileText = {
  variantCodes: VariantDynamicLabels;
} & SiteText['pages']['variants_page']['nl']['varianten_over_tijd_grafiek'];

export type StackedBarConfig<T extends TimestampedValue> = {
  metricProperty: keyof T;
  label: string;
  color: string;
};
