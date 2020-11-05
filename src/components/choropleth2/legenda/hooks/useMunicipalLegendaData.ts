import { municipalThresholds } from '~/components/choropleth2/municipal-thresholds';
import { TMunicipalityMetricName } from '~/components/choropleth2/shared';
import { useLegendaItems } from './useLegendaItems';

export function useMunicipalLegendaData(metric: TMunicipalityMetricName) {
  const thresholdInfo = municipalThresholds[metric];

  return useLegendaItems(thresholdInfo.thresholds);
}
