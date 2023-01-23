import { assert } from '@corona-dashboard/common';

// Determines the sorting order for a ordered data
export const getSortingOrder = (ageGroup: string | undefined, sortingOrder: string[], componentName: string) => {
  const index = sortingOrder.findIndex((sortingIndex) => sortingIndex === ageGroup);
  assert(index >= 0, `[${componentName}] No sorting order defined for age group ${ageGroup}`);
  return index;
};
