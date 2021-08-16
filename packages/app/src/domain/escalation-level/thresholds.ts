import { CategoricalBarScaleCategory } from '~/components/categorical-bar-scale';
import { useIntl } from '~/intl';
import { getMetricConfig } from '~/metric-config';

export function useEscalationThresholds() {
  const { siteText } = useIntl();
  const levels = siteText.escalatie_niveau.types;

  const { categoricalBarScale: positiveTestedConfigCategories } =
    getMetricConfig('vr', 'tested_overall', 'infected_per_100k');

  const { categoricalBarScale: hospitalAdmissionsConfigCategories } =
    getMetricConfig('vr', 'hospital_nice_sum', 'admissions_per_1m');

  const positiveTestedEscalationThresholds: CategoricalBarScaleCategory[] =
    positiveTestedConfigCategories?.categories.length
      ? positiveTestedConfigCategories?.categories.map((category, index) => ({
          ...category,
          name: levels[(index + 1).toString()]?.titel,
        }))
      : [];

  const hospitalAdmissionsEscalationThresholds: CategoricalBarScaleCategory[] =
    hospitalAdmissionsConfigCategories?.categories.length
      ? hospitalAdmissionsConfigCategories?.categories.map(
          (category, index) => ({
            ...category,
            name: levels[(index + 1).toString()]?.titel,
          })
        )
      : [];

  return {
    positiveTestedEscalationThresholds,
    hospitalAdmissionsEscalationThresholds,
  };
}
