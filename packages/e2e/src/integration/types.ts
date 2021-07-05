import { Municipal, Nl, Vr } from '@corona-dashboard/common';
import { Context } from 'mocha';

export type RegionalContext = Context & {
  regionData: Vr;
};

export type NlContext = Context & {
  nationalData: Nl;
};

export type MunicipalContext = Context & {
  municipalData: Municipal;
};
