import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { TMunicipalityMetricName } from '~/components/choropleth/shared';
import { useLegendaItems } from './use-legenda-items';

export function useMunicipalLegendaData(metric: TMunicipalityMetricName) {
  const thresholdInfo = municipalThresholds[metric];

  return useLegendaItems(thresholdInfo.thresholds);
}
