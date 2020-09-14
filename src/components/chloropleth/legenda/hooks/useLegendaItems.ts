import { scaleLinear } from '@vx/scale';
import { useMemo } from 'react';
import { ILegendaItem } from '../ChloroplethLegenda';

const NUMBER_OF_ITEMS = 5;

import siteText from 'locale';

export default function useLegendaItems(
  domain: [min: number, max: number] | undefined,
  gradient: [min: string, max: string]
) {
  return useMemo(() => {
    if (!domain) {
      return;
    }
    const [min, max] = domain;

    const color = scaleLinear({
      domain: domain,
      range: gradient,
    });
    const steps = (max - min) / NUMBER_OF_ITEMS;

    const calcValue = (i: number) => {
      return Math.floor(i > 0 ? i * steps : 0);
    };

    const legendaItems: ILegendaItem[] = [
      {
        color: '#C4C4C4',
        label:
          siteText.positief_geteste_personen.chloropleth_legenda.geen_meldingen,
      },
    ];

    for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
      const value = calcValue(i);
      const nextValue = calcValue(i + 1) - (i === NUMBER_OF_ITEMS - 1 ? 0 : 1);
      const label = `${value} - ${nextValue}`;
      legendaItems.push({
        color: color(value),
        label: label,
      });
    }

    return legendaItems;
  }, [domain, gradient]);
}
