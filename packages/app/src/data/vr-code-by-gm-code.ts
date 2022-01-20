import { gmData } from '@corona-dashboard/common';

export const vrCodeByGmCode: Record<string, string> = gmData.reduce(
  (acc, gm) => ({
    ...acc,
    [gm.gemcode]: gm.vrCode,
  }),
  {}
);
