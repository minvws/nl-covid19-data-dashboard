import { isPresent } from 'ts-is-present';
import { ChoroplethDataItem } from '~/components/choropleth/logic';
import { parseLabel } from './parse-fully-vaccinated-percentage-label';

export const getSecondaryMetric = (d: ChoroplethDataItem) => {
  if ('fully_vaccinated_percentage_label' in d) {
    return isPresent(d.fully_vaccinated_percentage_label)
      ? parseLabel(d.fully_vaccinated_percentage_label)
      : null;
  }

  return null;
};
