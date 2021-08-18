import { MetricKeys, Nl } from '@corona-dashboard/common';
import {
  hospitalAdmissionsBarScale,
  intensiveCareBarScale,
  positiveTestedBarScale,
  reproductionBarScale,
} from './bar-scales';
import { MetricConfig } from './common';

type NlMetricKey = MetricKeys<Nl>;
type NlConfig = Partial<Record<NlMetricKey, Record<string, MetricConfig>>>;

export const nl: NlConfig = {
  reproduction: {
    index_average: {
      isDecimal: true,
      barScale: reproductionBarScale,
    },
  },

  hospital_nice: {
    admissions_on_date_of_reporting: {
      isDecimal: true,
      barScale: hospitalAdmissionsBarScale,
    },
  },
  intensive_care_nice: {
    admissions_on_date_of_reporting: {
      isDecimal: true,
      barScale: intensiveCareBarScale,
    },
  },
  tested_overall: {
    infected_per_100k: {
      barScale: positiveTestedBarScale,
    },
  },
};
