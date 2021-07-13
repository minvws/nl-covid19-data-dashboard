import { In } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { getVariantChartData } from './get-variant-chart-data';

export function getInternationalVariantChartData(
  inData: Record<string, In>,
  variantTranslations: SiteText['covid_varianten']['varianten']
) {
  const variantChartData = Object.fromEntries(
    Object.entries(inData).map(([key, value]) => [
      key,
      getVariantChartData(value.variants, variantTranslations),
    ])
  );

  return { variantChartData } as const;
}
