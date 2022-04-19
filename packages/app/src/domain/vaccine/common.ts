import { colors } from '@corona-dashboard/common';

export const COLOR_FIRST = colors.data.scale.blue[0];
export const COLOR_LAST = colors.data.primary

export interface vaccinceMetrics {
    first: {
      label: string;
      percentage: string;
    };
    last: {
      label: string;
      percentage: string;
    };
  }