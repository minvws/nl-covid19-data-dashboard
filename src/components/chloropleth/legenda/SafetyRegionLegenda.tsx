import { TRegionMetricName } from '../shared';
import ChloroplethLegenda from './ChloroplethLegenda';
import useSafetyRegionLegendaData from './hooks/useSafetyRegionLegendaData';

export type TProps = {
  metricName: TRegionMetricName;
  title: string;
};

export default function SafetyRegionLegenda(props: TProps) {
  const { metricName, title } = props;
  const items = useSafetyRegionLegendaData(metricName);

  if (!items) {
    return null;
  }

  return items && <ChloroplethLegenda items={items} title={title} />;
}
