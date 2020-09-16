import { TMunicipalityMetricName } from '../shared';
import ChloroplethLegenda from './ChloroplethLegenda';
import useMunicipalLegendaData from './hooks/useMunicipalLegendaData';

export type TProps = {
  metricName: TMunicipalityMetricName;
  title: string;
  gradients?: [minColor: string, maxColor: string];
};

export default function MunicipalityLegenda(props: TProps) {
  const {
    metricName,
    title,
    gradients = ['#c0e8fc', '#87cbf8', '#5dafe4', '#3391cc', '#0579b3'],
  } = props;
  const items = useMunicipalLegendaData(metricName, gradients);

  if (!items) {
    return null;
  }

  return items && <ChloroplethLegenda items={items} title={title} />;
}
