import { useMemo } from 'react';
import { ILegendaItem } from '../ChloroplethLegenda';

import siteText from 'locale';

import { ChloroplethThresholdsValue } from 'components/chloropleth/shared';

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
      thresholds.map<ILegendaItem>((threshold: ChloroplethThresholdsValue) => {
        return {
          color: threshold.color,
          label: threshold.threshold.toFixed(1),
        };
      })
    );

    return legendaItems;
  }, [thresholds]);
}
