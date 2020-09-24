import { useMemo } from 'react';
import { ILegendaItem } from '../ChloroplethLegenda';

import { ChloroplethThresholdsValue } from '~/components/chloropleth/shared';

const createLabel = (list: ChloroplethThresholdsValue[], index: number) => {
  if (index === 0) {
    return `< ${list[1].threshold}`;
  }
  if (index === list.length - 1) {
    return `> ${list[index].threshold}`;
  }
  return `${list[index].threshold} - ${list[index + 1].threshold}`;
};

export function useLegendaItems(thresholds?: ChloroplethThresholdsValue[]) {
  return useMemo(() => {
    if (!thresholds) {
      return;
    }

    const legendaItems: ILegendaItem[] = thresholds.map<ILegendaItem>(
      (threshold: ChloroplethThresholdsValue, index: number) => {
        return {
          color: threshold.color,
          label: createLabel(thresholds, index),
        };
      }
    );

    return legendaItems;
  }, [thresholds]);
}
