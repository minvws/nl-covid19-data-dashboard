import { municipalThresholds } from '~/components/chloropleth/municipalThresholds';
import { TMunicipalityMetricName } from '~/components/chloropleth/shared';
import { useLegendaItems } from './useLegendaItems';

export function useMunicipalLegendaData(metric: TMunicipalityMetricName) {
  const thresholdInfo = municipalThresholds[metric];

  return useLegendaItems(thresholdInfo.thresholds);
}
