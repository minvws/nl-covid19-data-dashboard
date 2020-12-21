import { useMemo } from 'react';
import { restrictionIcons } from '~/components/restrictions/restriction-icons';
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
  'bezoek',
  'er_op_uit',
  'samenkomst',
  'horeca',
  'winkels',
  'contactberoep',
  'sport',
  'reizen_binnenland',
  'reizen_buitenland',
  'ov',
  'onderwijs',
  'huwelijk',
  'verpleeghuis',
  'uitvaart',
  'werk',
  'alcohol',
  'algemeen',
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

export type RestrictionValue =
  | RegionalRestrictionValue
  | NationalRestrictionValue;

/**
 * This hook constructs table data structure from the given RegionalRestrictionValue or NationalRestrictionValue list.
 * The table data holds the restrictions in rows consisting of a category and a restrictions column.
 */
export function useRestrictionsTable(data: RestrictionValue[]) {
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
function createRows(data: RestrictionValue[]) {
  const selectCategory = (value: RestrictionValue) => value.category_id;

  const makeUniqueList = (
    value: EscalationCategory,
    index: number,
    list: EscalationCategory[]
  ) => list.indexOf(value) === index;

  const sortByRowOrder = (
    left: EscalationCategory,
    right: EscalationCategory
  ) => rowOrder.indexOf(left) - rowOrder.indexOf(right);

  const sortedRows = data
    .map(selectCategory)
    .filter(makeUniqueList)
    .sort(sortByRowOrder);

  return sortedRows.map<RestrictionsRowData>((category) => ({
    categoryColumn: category,
    restrictionsColumn: createColumn(data, category),
  }));
}

/**
 * Creates a data column for the given category where the content of the column
 * is sorted by restriction order.
 */
function createColumn(data: RestrictionValue[], category: EscalationCategory) {
  const filterByCategory = (value: RestrictionValue) =>
    value.category_id === category;

  const sortByRestrictionOrder = (
    left: RestrictionValue,
    right: RestrictionValue
  ) => left.restriction_order - right.restriction_order;

  return data
    .filter(filterByCategory)
    .sort(sortByRestrictionOrder)
    .map<RestrictionColumnData>((value) => ({
      Icon: restrictionIcons[value.restriction_id],
      text: restrictionTexts[value.restriction_id] || value.restriction_id,
    }));
}
