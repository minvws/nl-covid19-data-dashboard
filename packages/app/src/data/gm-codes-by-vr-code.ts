import { gmData } from '@corona-dashboard/common';

export const gmCodesByVrCode = gmData.reduce<Record<string, string[]>>(
  (acc, gm) => {
    const vrGmCodes = acc[gm.vrCode] || [];
    return {
      ...acc,
      [gm.vrCode]: [...vrGmCodes, gm.gemcode],
    };
  },
  {}
);
