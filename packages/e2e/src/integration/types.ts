import { Context } from 'mocha';
import { Municipal, National, Regionaal } from '@corona-dashboard/common';

export type RegionalContext = Context & {
  regionData: Regionaal;
};

export type NationalContext = Context & {
  nationalData: National;
};

export type MunicipalContext = Context & {
  municipalData: Municipal;
};
