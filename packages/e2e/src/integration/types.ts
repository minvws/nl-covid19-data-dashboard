import { Municipal, National, Vr } from '@corona-dashboard/common';
import { Context } from 'mocha';

export type RegionalContext = Context & {
  regionData: Vr;
};

export type NationalContext = Context & {
  nationalData: National;
};

export type MunicipalContext = Context & {
  municipalData: Municipal;
};
