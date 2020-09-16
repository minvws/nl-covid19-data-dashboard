import { useMemo } from 'react';
import { ILegendaItem } from '../ChloroplethLegenda';

import siteText from 'locale';

import { ChloroplethThresholdsValue } from 'components/chloropleth/shared';

const createLabel = (list: ChloroplethThresholdsValue[], index: number) => {
  if (index === 0) {
    return `< ${list[1].threshold}`;
  }
  if (index === list.length - 1) {
    return `> ${list[index].threshold}`;
  }
  return `${list[index].threshold} - ${list[index + 1].threshold}`;
};

export default function useLegendaItems(
  thresholds?: ChloroplethThresholdsValue[]
) {
  return useMemo(() => {
    if (!thresholds) {
      return;
    }

    const legendaItems: ILegendaItem[] = [
      {
        color: '#C4C4C4',
        label:
          siteText.positief_geteste_personen.chloropleth_legenda.geen_meldingen,
      },
    ].concat(
      thresholds.map<ILegendaItem>(
        (threshold: ChloroplethThresholdsValue, index: number) => {
          return {
            color: threshold.color,
            label: createLabel(thresholds, index),
          };
        }
      )
    );

    return legendaItems;
  }, [thresholds]);
}
