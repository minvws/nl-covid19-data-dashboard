import { useMemo } from 'react';
import { ILegendaItem } from '../ChloroplethLegenda';

import siteText from 'locale';
import { scaleQuantile } from 'd3-scale';

export default function useLegendaItems(
  domain: [min: number, max: number] | undefined,
  gradient: string[]
) {
  return useMemo(() => {
    if (!domain) {
      return;
    }
    const [min, max] = domain;

    const color = scaleQuantile()
      .domain(domain)
      .range(gradient as any);

    const quantiles = [min].concat(color.quantiles());

    const legendaItems: ILegendaItem[] = [
      {
        color: '#C4C4C4',
        label:
          siteText.positief_geteste_personen.chloropleth_legenda.geen_meldingen,
      },
    ].concat(
      quantiles.map<ILegendaItem>((q: number, index: number) => {
        const next = index < quantiles.length - 1 ? quantiles[index + 1] : max;
        return {
          color: color(q) as any,
          label: `${q.toFixed(1)} - ${next.toFixed(1)}`,
        };
      })
    );

    return legendaItems;
  }, [domain, gradient]);
}
