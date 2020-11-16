import { useMemo } from 'react';
import { restrictionIcons } from '~/components/restrictions/restrictionIcons';
import siteText from '~/locale/index';
import {
  NationalRestrictionValue,
  RegionalRestrictionValue,
} from '~/types/data';

const restrictionTexts: Record<string, string> = siteText.maatregelen.teksten;

/**
 * This is a hard-coded list of categories that dictates where a restriction category
 * is rendered in the table.
 */
const rowOrder: EscalationCategory[] = [
  'algemeen',
  'er_op_uit',
  'bezoek',
  'samenkomst',
  'huwelijk',
  'verpleeghuis',
  'horeca',
  'sport',
  'reizen_binnenland',
  'reizen_buitenland',
  'ov',
  'uitvaart',
  'onderwijs',
  'werk',
  'winkels',
  'alcohol',
];

export type EscalationCategory = RegionalRestrictionValue['category_id'];
export type EscalationLevel = RegionalRestrictionValue['escalation_level'];
export type TargetRegion = RegionalRestrictionValue['target_region'];

export type RestrictionColumnData = {
  Icon?: any;
  text: string;
};

export type RestrictionsRowData = {
  categoryColumn: EscalationCategory;
  restrictionsColumn: RestrictionColumnData[];
};

export type RestrictionsTableData = {
  rows: RestrictionsRowData[];
};

/**
 * This hook constructs table data structure from the given RegionalRestrictionValue or NationalRestrictionValue list.
 * The table data holds the restrictions in rows consisting of a category and a restrictions column.
 */
export function useRestrictionsTable(
  data: (RegionalRestrictionValue | NationalRestrictionValue)[]
) {
  return useMemo(() => {
    const table: RestrictionsTableData = {
      rows: createRows(data),
    };
    return table;
  }, [data]);
}

/***
 * Creates unique category rows sorted based on the hardcoded rowOrder list.
 * Each row has a category as its title and holds a list of columns
 */
function createRows(
  data: (RegionalRestrictionValue | NationalRestrictionValue)[]
) {
  const uniqueCategories = data
    .map((value) => value.category_id)
    .filter((value, index, list) => list.indexOf(value) === index)
    .sort((left, right) => rowOrder.indexOf(left) - rowOrder.indexOf(right));

  return uniqueCategories.map<RestrictionsRowData>((category) => ({
    categoryColumn: category,
    restrictionsColumn: createColumn(data, category),
  }));
}

/**
 * Creates a data column for the given category where the content of the column
 * is sorted by restriction order.
 */
function createColumn(
  data: (RegionalRestrictionValue | NationalRestrictionValue)[],
  category: EscalationCategory
) {
  return data
    .filter((value) => value.category_id === category)
    .sort((left, right) => left.restriction_order - right.restriction_order)
    .map<RestrictionColumnData>((value) => ({
      Icon: restrictionIcons[value.restriction_id],
      text: restrictionTexts[value.restriction_id] ?? value.restriction_id,
    }));
}
