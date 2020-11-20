import { LegendaItem } from '~/components-styled/choropleth-legenda';
import { ChoroplethThresholdsValue } from '~/components/choropleth/shared';

export function useLegendaItems(thresholds: ChoroplethThresholdsValue[]) {
  const legendaItems: LegendaItem[] = thresholds.map<LegendaItem>(
    (threshold: ChoroplethThresholdsValue, index: number) => {
      return {
        color: threshold.color,
        label: createLabel(thresholds, index),
      };
    }
  );

  return legendaItems;
}

function createLabel(list: ChoroplethThresholdsValue[], index: number) {
  if (index === 0) {
    return `< ${list[1].threshold}`;
  }
  if (index === list.length - 1) {
    return `> ${list[index].threshold}`;
  }
  return `${list[index].threshold} - ${list[index + 1].threshold}`;
}
