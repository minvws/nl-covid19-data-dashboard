import { CategoricalBarScaleCategory } from '~/components/categorical-bar-scale';
import { useIntl } from '~/intl';
import { getMetricConfig } from '~/metric-config';

export function useEscalationThresholds() {
  const { siteText } = useIntl();
  const levels = siteText.escalatie_niveau.types;

  const { riskCategoryThresholds: positiveTestedConfigCategories } =
    getMetricConfig('vr', 'tested_overall', 'infected_per_100k');

  const { riskCategoryThresholds: hospitalAdmissionsConfigCategories } =
    getMetricConfig('vr', 'hospital_nice_sum', 'admissions_per_1m');

  const positiveTestedEscalationThresholds: CategoricalBarScaleCategory[] =
    positiveTestedConfigCategories?.length
      ? positiveTestedConfigCategories?.map((category, index) => ({
          ...category,
          name: levels[(index + 1).toString()]?.titel,
        }))
      : [];

  const hospitalAdmissionsEscalationThresholds: CategoricalBarScaleCategory[] =
    hospitalAdmissionsConfigCategories?.length
      ? hospitalAdmissionsConfigCategories?.map((category, index) => ({
          ...category,
          name: levels[(index + 1).toString()]?.titel,
        }))
      : [];

  return {
    positiveTestedEscalationThresholds,
    hospitalAdmissionsEscalationThresholds,
  };
}
