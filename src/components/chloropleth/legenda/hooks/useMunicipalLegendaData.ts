import { scaleLinear } from '@vx/scale';
import { TMunicipalityMetricName } from 'components/chloropleth/shared';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Municipalities } from 'types/data';
import useExtent from 'utils/useExtent';
import { ILegendaItem } from '../ChloroplethLegenda';

export default function useMunicipalLegendaData(
  metric: TMunicipalityMetricName,
  gradient: [min: string, max: string]
) {
  const { data } = useSWR<Municipalities>('/json/MUNICIPALITIES.json');

  const metrics = data?.[metric];
  const domain = useExtent(metrics, (item: any) => item[metric]);

  return useMemo(() => {
    if (!domain) {
      return;
    }
    const [min, max] = domain;

    const color = scaleLinear({
      domain: domain,
      range: gradient,
    });
    const steps = (max - min) / 5;

    const calcValue = (i: number) => {
      return Math.floor(i > 0 ? i * steps : 0);
    };

    const legendaItems: ILegendaItem[] = [
      {
        color: '#C4C4C4',
        label: 'Geen meldingen',
      },
    ];
    for (let i = 0; i < 5; i++) {
      const value = calcValue(i);
      const nextValue = calcValue(i + 1) - (i === 4 ? 0 : 1);
      const label = `${value} - ${nextValue}`;
      legendaItems.push({
        color: color(value),
        label: label,
      });
    }

    return legendaItems;
  }, [data, domain, gradient]);
}
