import { TMunicipalityMetricName } from '../shared';
import ChloroplethLegenda from './ChloroplethLegenda';
import useMunicipalLegendaData from './hooks/useMunicipalLegendaData';

export type TProps = {
  metricName: TMunicipalityMetricName;
  title: string;
  gradients: [minColor: string, maxColor: string];
};

export default function MunicipalityLegenda(props: TProps) {
  const { metricName, title, gradients } = props;
  const items = useMunicipalLegendaData(metricName, gradients);

  if (!items) {
    return null;
  }

  return items && <ChloroplethLegenda items={items} title={title} />;
}

MunicipalityLegenda.defaultProps = {
  gradients: ['#C0E8FC', '#0579B3'],
};
