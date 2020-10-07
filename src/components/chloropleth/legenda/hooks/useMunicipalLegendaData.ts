import { TMunicipalityMetricName } from '~/components/chloropleth/shared';
import { municipalThresholds } from '~/components/chloropleth/municipalThresholds';

import { useLegendaItems } from './useLegendaItems';

export function useMunicipalLegendaData(metric: TMunicipalityMetricName) {
  const ths = municipalThresholds[metric];

  return useLegendaItems(ths.thresholds);
}
