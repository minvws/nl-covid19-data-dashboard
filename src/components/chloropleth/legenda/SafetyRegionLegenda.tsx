import { TRegionMetricName } from '../shared';
import ChloroplethLegenda from './ChloroplethLegenda';
import useSafetyRegionLegendaData from './hooks/useSafetyRegionLegendaData';

export type TProps = {
  metricName: TRegionMetricName;
  title: string;
  gradients?: [minColor: string, maxColor: string];
};

export default function SafetyRegionLegenda(props: TProps) {
  const {
    metricName,
    title,
    gradients = ['#c0e8fc', '#87cbf8', '#5dafe4', '#3391cc', '#0579b3'],
  } = props;
  const items = useSafetyRegionLegendaData(metricName, gradients);

  if (!items) {
    return null;
  }

  return items && <ChloroplethLegenda items={items} title={title} />;
}
