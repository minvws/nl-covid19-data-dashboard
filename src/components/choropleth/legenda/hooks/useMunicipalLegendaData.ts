import { municipalThresholds } from '~/components/choropleth/municipalThresholds';
import { TMunicipalityMetricName } from '~/components/choropleth/shared';
import { useLegendaItems } from './useLegendaItems';

export function useMunicipalLegendaData(metric: TMunicipalityMetricName) {
  const thresholdInfo = municipalThresholds[metric];

  return useLegendaItems(thresholdInfo.thresholds);
}
