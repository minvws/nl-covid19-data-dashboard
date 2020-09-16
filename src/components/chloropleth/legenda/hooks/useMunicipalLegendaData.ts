import { thresholds } from 'components/chloropleth/MunicipalityChloropleth';
import { TMunicipalityMetricName } from 'components/chloropleth/shared';

import useLegendaItems from './useLegendaItems';

export default function useMunicipalLegendaData(
  metric: TMunicipalityMetricName
) {
  const ths = thresholds[metric];

  return useLegendaItems(ths.thresholds);
}
