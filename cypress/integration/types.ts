import { Context } from 'mocha';
import { Municipal, National, Regionaal } from '~/types/data';

export type RegionalContext = Context & {
  regionData: Regionaal;
};

export type NationalContext = Context & {
  nationalData: National;
};

export type MunicipalContext = Context & {
  municipalData: Municipal;
};
