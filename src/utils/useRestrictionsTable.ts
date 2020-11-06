import { useMemo } from 'react';
import {
  NationalRestrictionValue,
  RegionalRestrictionValue,
} from '~/types/data';
import siteText from '~/locale/index';

const restrictionTexts: Record<string, string> = siteText.maatregelen.teksten;
const restrictionIcons: Record<string, string> = siteText.maatregelen.icons;

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

export type RestrictionLineData = {
  icon?: string;
  text: string;
};

export type RestrictionsRowData = {
  category: EscalationCategory;
  restrictions: RestrictionLineData[];
};

export type RestrictionsTableData = {
  rows: RestrictionsRowData[];
};

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

function createRows(
  data: (RegionalRestrictionValue | NationalRestrictionValue)[]
) {
  const uniqueCategories = data
    .map((value) => value.category_id)
    .filter((value, index, list) => list.indexOf(value) === index)
    .sort((left, right) => rowOrder.indexOf(left) - rowOrder.indexOf(right));

  return uniqueCategories.map<RestrictionsRowData>((category) => ({
    category: category,
    restrictions: createLines(data, category),
  }));
}

function createLines(
  data: (RegionalRestrictionValue | NationalRestrictionValue)[],
  category: EscalationCategory
) {
  return data
    .filter((value) => value.category_id === category)
    .sort((left, right) => left.restriction_order - right.restriction_order)
    .map<RestrictionLineData>((value) => ({
      icon: restrictionIcons[value.restriction_id],
      text: restrictionTexts[value.restriction_id] ?? value.restriction_id,
    }));
}
