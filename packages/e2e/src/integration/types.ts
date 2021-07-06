import { Gm, Nl, Vr } from '@corona-dashboard/common';
import { Context } from 'mocha';

export type RegionalContext = Context & {
  regionData: Vr;
};

export type NlContext = Context & {
  nationalData: Nl;
};

export type GmContext = Context & {
  municipalData: Gm;
};
