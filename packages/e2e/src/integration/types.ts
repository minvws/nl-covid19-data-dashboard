import { Municipal, Nl, Regionaal } from '@corona-dashboard/common';
import { Context } from 'mocha';

export type RegionalContext = Context & {
  regionData: Regionaal;
};

export type NlContext = Context & {
  nationalData: Nl;
};

export type MunicipalContext = Context & {
  municipalData: Municipal;
};
