import { Gm, National, Regionaal } from '@corona-dashboard/common';
import { Context } from 'mocha';

export type RegionalContext = Context & {
  regionData: Regionaal;
};

export type NationalContext = Context & {
  nationalData: National;
};

export type GmContext = Context & {
  municipalData: Gm;
};
