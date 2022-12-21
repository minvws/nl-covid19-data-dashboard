import { colors, Nl } from '@corona-dashboard/common';
import { ScopedMetricConfigs } from './common';

const GREEN = colors.green1;
const YELLOW = colors.yellow4;
const RED = colors.red2;

export const nl: ScopedMetricConfigs<Nl> = {
  intensive_care_lcps: {
    beds_occupied_covid: {
      barScale: {
        min: 0,
        max: 200,
        limit: 200,
        gradient: [
          {
            color: GREEN,
            value: 0,
          },
          {
            color: GREEN,
            value: 50,
          },
          {
            color: YELLOW,
            value: 100,
          },
          {
            color: YELLOW,
            value: 150,
          },
          {
            color: RED,
            value: 200,
          },
        ],
      },
    },
  },
};
