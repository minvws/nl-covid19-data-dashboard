import { colors } from '~/style/theme';
import { ChoroplethThresholds, TMunicipalityMetricName } from './shared';

const positiveTestedThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.data.scale.blue[0],
      threshold: 0,
    },
    {
      color: colors.data.scale.blue[1],
      threshold: 4,
    },
    {
      color: colors.data.scale.blue[2],
      threshold: 7,
    },
    {
      color: colors.data.scale.blue[3],
      threshold: 10,
    },
    {
      color: colors.data.scale.blue[4],
      threshold: 20,
    },
    {
      color: colors.data.scale.blue[5],
      threshold: 30,
    },
  ],
};

const hospitalAdmissionsThresholds: ChoroplethThresholds = {
  thresholds: [
    {
      color: colors.data.scale.blue[0],
      threshold: 0,
    },
    {
      color: colors.data.scale.blue[1],
      threshold: 3,
    },
    {
      color: colors.data.scale.blue[2],
      threshold: 6,
    },
    {
      color: colors.data.scale.blue[3],
      threshold: 9,
    },
    {
      color: colors.data.scale.blue[4],
      threshold: 15,
    },
  ],
};

export const municipalThresholds: Record<
  TMunicipalityMetricName,
  ChoroplethThresholds
> = {
  positive_tested_people: positiveTestedThresholds,
  hospital_admissions: hospitalAdmissionsThresholds,
};
