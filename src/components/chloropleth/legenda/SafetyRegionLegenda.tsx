import { TRegionMetricName } from '../shared';
import ChloroplethLegenda from './ChloroplethLegenda';
import useSafetyRegionLegendaData from './hooks/useSafetyRegionLegendaData';

export type TProps = {
  metricName: TRegionMetricName;
  title: string;
  gradients?: [minColor: string, maxColor: string];
};

export default function SafetyRegionLegenda(props: TProps) {
  const { metricName, title, gradients = ['#C0E8FC', '#0579B3'] } = props;
  const items = useSafetyRegionLegendaData(metricName, gradients);

  if (!items) {
    return null;
  }

  return items && <ChloroplethLegenda items={items} title={title} />;
}
