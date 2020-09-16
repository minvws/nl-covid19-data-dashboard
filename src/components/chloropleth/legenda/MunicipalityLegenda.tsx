import { TMunicipalityMetricName } from '../shared';
import ChloroplethLegenda from './ChloroplethLegenda';
import useMunicipalLegendaData from './hooks/useMunicipalLegendaData';

export type TProps = {
  metricName: TMunicipalityMetricName;
  title: string;
};

export default function MunicipalityLegenda(props: TProps) {
  const { metricName, title } = props;
  const items = useMunicipalLegendaData(metricName);

  if (!items) {
    return null;
  }

  return items && <ChloroplethLegenda items={items} title={title} />;
}
