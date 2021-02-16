import { CategoricalBarScaleCategory } from '~/components-styled/categorical-bar-scale';
import { colors } from '~/style/theme';
import siteText from '~/locale/index';

const levels = siteText.escalatie_niveau.types;

export const positiveTestedEscalationThresholds: CategoricalBarScaleCategory[] = [
  {
    name: levels['1'].titel,
    threshold: 0,
    color: colors.data.scale.magenta[0],
  },
  {
    name: levels['2'].titel,
    threshold: 35,
    color: colors.data.scale.magenta[1],
  },
  {
    name: levels['3'].titel,
    threshold: 100,
    color: colors.data.scale.magenta[2],
  },
  {
    name: levels['4'].titel,
    threshold: 250,
    color: colors.data.scale.magenta[3],
  },
  {
    threshold: 300,
  },
];

export const hospitalAdmissionsEscalationThresholds: CategoricalBarScaleCategory[] = [
  {
    name: levels['1'].titel,
    threshold: 0,
    color: colors.data.scale.magenta[0],
  },
  {
    name: levels['2'].titel,
    threshold: 4,
    color: colors.data.scale.magenta[1],
  },
  {
    name: levels['3'].titel,
    threshold: 16,
    color: colors.data.scale.magenta[2],
  },
  {
    name: levels['4'].titel,
    threshold: 27,
    color: colors.data.scale.magenta[3],
  },
  {
    threshold: 30,
  },
];
