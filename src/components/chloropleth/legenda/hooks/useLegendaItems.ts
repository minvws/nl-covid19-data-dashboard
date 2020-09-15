import { scaleLinear } from '@vx/scale';
import { useMemo } from 'react';
import { ILegendaItem } from '../ChloroplethLegenda';

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
    const numberOfItems = calculateDivisible(max - min);
    const steps = (max - min) / numberOfItems;

    const calcValue = (i: number) => {
      if (i === numberOfItems) return max;
      return Math.floor(i > 0 ? i * steps : 0);
    };

    const legendaItems: ILegendaItem[] = [
      {
        color: '#C4C4C4',
        label:
          siteText.positief_geteste_personen.chloropleth_legenda.geen_meldingen,
      },
    ];

    for (let i = 0; i < numberOfItems; i++) {
      const value = calcValue(i);
      const nextValue = calcValue(i + 1);
      const label = `${value} - ${nextValue}`;
      legendaItems.push({
        color: color(i === numberOfItems - 1 ? nextValue : value),
        label: label,
      });
    }

    return legendaItems;
  }, [domain, gradient]);
}

function calculateDivisible(input: number) {
  let div = 5;
  let quotient = Math.floor(input / div);

  while (quotient === 0 && div > 0) {
    quotient = Math.floor(input / --div);
  }

  return div;
}
