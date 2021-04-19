import { NlEscalationThresholds } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { CategoricalBarScaleCategory } from '~/components/categorical-bar-scale';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';

export function useEscalationThresholds(thresholds: NlEscalationThresholds) {
  const { siteText } = useIntl();
  const levels = siteText.escalatie_niveau.types as Record<
    string,
    { titel: string }
  >;

  return useMemo(() => {
    const escalationThresholds = {
      positiveTestedEscalationThresholds: thresholds.tested_overall_sum.infected_per_100k.map<CategoricalBarScaleCategory>(
        (x, index) => ({
          name: levels[x.escalation_level.toString()].titel,
          threshold: x.threshold,
          color: colors.data.scale.magenta[index],
        })
      ),
      hospitalAdmissionsEscalationThresholds: thresholds.hospital_nice_sum.admissions_per_1m.map<CategoricalBarScaleCategory>(
        (x, index) => ({
          name: levels[x.escalation_level.toString()].titel,
          threshold: x.threshold,
          color: colors.data.scale.magenta[index],
        })
      ),
    };
    // These last thresholds are only added for visual reasons, they are not provided by the
    // backend since they are not involved in any calculations. They are purely here to determine
    // the size of the last bar in the categorical chart
    escalationThresholds.positiveTestedEscalationThresholds.push({
      threshold: 300,
    });
    escalationThresholds.hospitalAdmissionsEscalationThresholds.push({
      threshold: 30,
    });

    return escalationThresholds;
  }, [thresholds]);
}
